(true: 1)      
(false: 0)

(zero?: [x] (eq? x 0))
(empty?: [x] (eq? x []))
(inc: [a] (add a 1))
(negative?: [x] (lt? x 0))
(positive?: [x] (gte? x 0))

(length: [l]
    (if (empty? l) 0
        (add 1 (length (tail l)))))

(nth: [l i]
    (if (zero? i) (head l)
        (nth (tail l) (sub i 1))))

(map: [l f]
    (if (empty? l) []
        (cons (f (head l)) (map (tail l) f))))

(reduce: [b l f]
  (let (foldaux: [ll res]
           (if (empty? ll) res               
               (foldaux (tail ll) (f res (head ll)))))
       (foldaux l b)))

(reduceR: [b l f]
  (let (foldaux: [ll res]
           (if (empty? ll) res               
               (f (head ll) (foldaux (tail ll) res))))
       (foldaux l b)))

(reverse: [l f] (reduce nil l ([acc e] (cons e acc))))
(filter: [l f] (reduceR nil l ([e acc] (if (f e) (cons e acc) acc))))

(debug (map [1 2 3] ([x] (add x 3))))
(debug (reverse [1 2 3]))
(debug (filter [1 2 3 4 5 6] ([x] (gte? x 4))))
(reduce 0 [1 2 3] add)
