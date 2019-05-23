#!/usr/bin/env node

import * as P from 'parsimmon'
import { readFileSync } from 'fs'
import * as commandLineArgs from 'command-line-args'

type Number = { type: 'number', value: number }
type Symbol = { type: 'symbol', value: string }
type List = { type: 'list', elements: Expression[] }
type Call = { type: 'call', func: Symbol, args: Expression[] }
type Pipe = { type: 'pipe', exp: Expression, f: Symbol }
type Expression = Number | Symbol | DefLet | Conditional | Call | List | Lambda | Pipe
type DefFun = { type: 'deffun', name: Symbol, args: Symbol[], body: Expression }
type Lambda = { type: 'lambda', args: Symbol[], body: Expression }
type DefVar = { type: 'defvar', name: Symbol, body: Expression }
type DefLet = { type: 'deflet', defs: DefFun | DefVar, body: Expression }
type Conditional = { type: 'if', test: Expression, then: Expression, else: Expression }

interface Language {
    aNumber: Number
    aSymbol: Symbol
    aCall: Call
    anExpression: Expression
    aFunction: DefFun
    aLet: DefLet
    aLambda: Lambda
    aList: List
    aPipe: Pipe
    nonPipe: Exclude<Expression, Pipe>
    aDefinition: DefVar
    aConditional: Conditional
    aProgram: Array<DefFun | DefVar | Expression>
}

const sExpr = <T>(p: P.Parser<T>) => p.wrap(P.string('('), P.string(')')).trim(P.optWhitespace)
const bExpr = <T>(p: P.Parser<T>) => p.wrap(P.string('['), P.string(']')).trim(P.optWhitespace)

const language = P.createLanguage<Language>({
    aNumber: _ => P.regexp(/-?[0-9]+/).trim(P.optWhitespace).desc('number')
        .map(m => ({ type: 'number', value: Number(m) })),

    aSymbol: _ => P.regexp(/[a-zA-Z_-][a-zA-Z0-9_-]*[\\?]?/).trim(P.optWhitespace).desc('symbol')
        .map(m => ({ type: 'symbol', value: m })),

    aCall: p => sExpr(P.seq(p.aSymbol, p.anExpression.atLeast(1)))
        .map(m => ({ type: 'call', func: m[0], args: m[1] })),
    
    aLet: p => sExpr(P.string('let').then(P.seq(P.alt(p.aFunction, p.aDefinition), p.anExpression)))
        .map(m => ({ type: 'deflet', defs: m[0], body: m[1] })),
    
    aConditional: p => sExpr(P.string('if').then(p.anExpression.times(3)))
        .map(m => ({ type: 'if', test: m[0], then: m[1], else: m[2] })),

    aList: p => bExpr(p.anExpression.many())
        .map(m => ({ type: 'list', elements: m })),

    aLambda: p => sExpr(P.seq(bExpr(p.aSymbol.many()), p.anExpression))
        .map(m => ({ type: 'lambda', args: m[0], body: m[1] })),

    aFunction: p => sExpr(P.seq(p.aSymbol.skip(P.string(':')), bExpr(p.aSymbol.many()), p.anExpression))
        .map(m => ({ type: 'deffun', name: m[0], args: m[1], body: m[2] })),

    aDefinition: p => sExpr(P.seq(p.aSymbol.skip(P.string(':')), p.anExpression))
        .map(m => ({ type: 'defvar', name: m[0], body: m[1] })),
    
    aPipe: p => P.seq(p.nonPipe, (P.string('|>').then(p.aSymbol).atLeast(1)))
        .map(m => (m[1].reduce((acc, e) => ({ type: 'pipe', f: e, exp: acc }), m[0] as Expression)) as Pipe),

    nonPipe: p => P.alt(p.aNumber, p.aSymbol, p.aLet, p.aConditional, p.aCall, p.aList, p.aLambda),

    anExpression: p => p.aPipe.or(sExpr(p.anExpression)).or(p.nonPipe).trim(P.optWhitespace),

    aProgram: p => P.alt(p.aFunction, p.aDefinition, p.anExpression).trim(P.optWhitespace).many()
})

function parse(source: string) {
    return language.aProgram.parse(source)
}

function t(e: Expression | DefFun | DefVar): string {
    switch (e.type) {
        case 'number': return e.value.toString()
        case 'symbol': return `_${e.value.replace('?', '_bool')}`
        case 'if':     return `(${t(e.test)}) ? (${t(e.then)}) : (${t(e.else)})`
        case 'call':   return `${t(e.func)}${e.args.map(a => `(${t(a)})`).join('')}`
        case 'deflet': return `{ ${t(e.defs)}; return ${t(e.body)} }`
        case 'lambda': return `${e.args.map(t).join(' => ')} => ${t(e.body)}`
        case 'pipe':   return `${t(e.f)}(${t(e.exp)})`
        case 'defvar': return `const ${t(e.name)} = ${t(e.body)}`
        case 'deffun': return `const ${t(e.name)} = ${e.args.map(t).join(' => ')} => ${t(e.body)}`
        case 'list':   return t(e.elements.concat({ type: 'symbol', value: 'nil' })
                                 .reduceRight((e, acc) => ({ type: 'call', func: { type: 'symbol', value: 'cons' }, args: [acc, e] })))
        default:       return ''
    }
}

const cli = commandLineArgs([
    { name: 'input', alias: 'i', defaultOption: true },
    { name: 'code', type: Boolean, defaultValue: false },
    { name: 'optimise', alias: 'o', type: Boolean, defaultValue: false }
])

if (cli.input === undefined) {
    console.error("Missing filename")
    process.exit(1)
} 

const result = parse(String(readFileSync(cli.input)))

if (result.status) {
    const builtins = String(readFileSync("build/lib/builtins.js")) + '\n'
    const program = builtins + result.value.map(t).join(';\n')
    if (cli.code !== true) console.log(eval(program))
    else console.log(program)
} else {
    console.error(result)
}
