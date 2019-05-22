const _nil = []

function _eq_bool(a, b) { return a === b }
function _lt_bool(a, b) { return a < b }
function _lte_bool(a, b) { return a <= b }
function _gt_bool(a, b) { return a > b }
function _gte_bool(a, b) { return a >= b }

function _and(a, b) { return a && b }
function _or(a, b) { return a || b }
function _not(a) { return !a }

function _fst(...args) { return args[0] }
function _snd(...args) { return args[1] }
function _add(a, b) { return a + b }
function _sub(a, b) { return a - b }

function _cons(a, b) { return [a, b] }
function _head(l) { const [h, _] = l; return h }
function _tail(l) { const [_, t] = l; return t }

function _debug(e) { console.log(e) }

function _atom_bool(a) { return typeof(a) === 'number' || Array.isArray(a) }
