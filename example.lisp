(true: 1)      
(false: 0)

(zero?: [x] (eq? x 0))
(empty?: [x] (eq? x []))
(inc: [a] (add a 1))

(length: [l]
    (if (empty? l)
        0
        (add 1 (length (tail l))))
)

(nth: [l i]
    (if (zero? i)
        (head l)
        (nth (tail l) (sub i 1)))
)

(map: [l f]
    (if (empty? l)
        []
        (cons (f (head l)) (map (tail l) f))))

(map [1 2 3] inc)
