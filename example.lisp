(zero?: (eq? 0))
(empty?: (eq? []))
(inc: (add 1))
(negative?: (gt? 0))
(positive?: (lte? 0))

(length: [l]
    (if (empty? l) 0
        (add 1 (l |> tail |> length))))

(nth: [l i]
    (if (zero? i) (head l)
        (nth (tail l) (sub i 1))))

(map: [f l]
    (if (empty? l) []
        (cons (f (head l)) (map f (tail l)))))

(reduce: [b f l]
  (let (foldaux: [ll res]
           (if (empty? ll) res               
               (foldaux (tail ll) (f res (head ll)))))
       (foldaux l b)))

(reduceR: [b f l]
  (let (foldaux: [ll res]
           (if (empty? ll) res               
               (f (head ll) (foldaux (tail ll) res))))
       (foldaux l b)))

(reverse: (reduce nil ([acc e] (cons e acc))))
(filter: [f] (reduceR nil ([e acc] (if (f e) (cons e acc) acc))))
(last?: [l] (head l |> reverse))

(debug (map (add 3) [1 2 3]))
(debug (reverse [1 2 3]))
(debug (filter (lte? 4) [1 2 3 4 5 6]))
(reduce 0 add [1 2 3])
