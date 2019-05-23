const _nil = []
const _true = true
const _false = false

const _eq_bool = a => b => a === b
const _lt_bool = a => b => a < b 
const _lte_bool = a => b => a <= b 
const _gt_bool = a => b => a > b 
const _gte_bool = a => b => a >= b 

const _and = a => b => a && b 
const _or = a => b => a || b 
const _not = a => !a 

const _add = a => b => a + b
const _sub = a => b => a - b

const _cons = a => b => [a, b]
const _head = l => l[0]
const _tail = l => l[1]

const _debug = e => console.debug(e)
const _write = e => console.log(e)

const _atom_bool = a => typeof(a) === 'number' || Array.isArray(a) 
