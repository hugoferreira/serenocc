(zero?: (eq? 0))
(empty?: (eq? []))
(inc: (add 1))
(negative?: (gt? 0))
(positive?: (lte? 0))

(length: [l]
    (if (empty? l) 0
        (add 1 (l |> tail |> length))))

(nth: [i l]
    (if (zero? i) (head l)
        (nth (sub i 1) (tail l))))

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
(last?: [l] (l |> reverse |> head))

(debug (map (add 3) [1 2 3]))
(debug (reverse [1 2 3]))
(debug (filter (lte? 4) [1 2 3 4 5 6]))
(debug (reduce 0 add [1 2 3]))
(debug (last? [1 2 3 4 5]))
(debug (nth 3 [1 2 3 4 5]))