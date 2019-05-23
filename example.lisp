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

(reduce: [b f]
  (let (foldaux: [res l]
           (if (empty? l) res               
               (foldaux (f res (head l)) (tail l))))
       (foldaux b)))

(reduceR: [b f]
  (let (foldaux: [res l]
           (if (empty? l) res               
               (f (foldaux (tail l) res) (head l))))
       (foldaux b)))

(reverse: (reduce nil ([acc e] (cons e acc))))
(filter: [f] (reduceR nil ([e acc] (if (f e) (cons e acc) acc))))
(last?: [l] (l |> reverse |> head))

(debug (map (add 3) [1 2 3]))
(debug (reverse [1 2 3]))
(debug (filter (lte? 4) [1 2 3 4 5 6]))
(debug (reduce 0 add [1 2 3]))
(debug (last? [1 2 3 4 5]))
(debug (nth 3 [1 2 3 4 5]))