(module
 (type $0 (func (param i32 i32) (result i32)))
 (global $global$0 i32 (i32.const 8))
 (memory $0 0)
 (export "memory" (memory $0))
 (export "test" (func $main/test))
 (func $main/test (; 0 ;) (type $0) (param $var$0 i32) (param $var$1 i32) (result i32)
  (i32.add
   (i32.add
    (get_local $var$0)
    (get_local $var$1)
   )
   (i32.const 3)
  )
 )
 ;; custom section "sourceMappingURL", size 14
)
