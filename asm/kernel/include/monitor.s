read_command_string:
    .string "read"

write_command_string:
    .string "write"

jump_command_string:
    .string "jump"

commands:
    ; read <addr> <count>
    .word read_command_string ; command string
    .byte 2 ; num parameters
    .word read_command_implementation

    ; write <addr> <value>
    .word write_command_string ; command string
    .byte 2 ; num parameters
    .word write_command_implementation

    ; jump <addr>
    .word jump_command_string ; command string
    .byte 1 ; num parameters
    .word jump_command_implementation


; Enter monitor REPL
monitor_loop:
    lda #">"
    jsr putc
    
    lda #$1c
    jsr puthex

    ldx #0
.read:
    jsr getc
    cmp #0
    beq .read

    cmp #$0a ; Was enter pressed?
    beq .command_entered

    jsr putc
    sta COMMAND_BUFFER, x
    inx

    jmp .read

.command_entered:
    lda #0
    sta COMMAND_BUFFER, x ; Put null terminator into command
    ldx #0
    ldy #0

    ; Load command buffer into param 1
    lda #<COMMAND_BUFFER
    sta PARAM_16_1
    lda #>COMMAND_BUFFER
    sta PARAM_16_1 + 1

.next_command:
    ; Load current command into param 2
    lda commands, x
    sta PARAM_16_2
    inx
    lda commands, x
    sta PARAM_16_2 + 1

    jsr str_startswith
    cmp #0
    bne .command_recieved

    ; Go to next command
    inx
    inx
    inx
    iny

    cpx #$10 ; Have we checked the last available command?
    bne .next_command

    jmp _monitor_loop_command_error
     
.command_recieved:
    ; We have a valid command
    ; Parse out the parameters eventually
    inx ; num parameters

; This code should work but the emulated CPU doesn't support inderict JMP
;     inx ; firt part of handler address

; brk_before_jump:
;     jmp (commands, x)

    ; Hardcode the command handlers for now
    cpy #0
    beq read_command_implementation

    cpy #1
    beq write_command_implementation

    cpy #2
    beq jump_command_implementation    

_command_exuction_complete:
    jsr newline
    jmp monitor_loop

bad_command_string:
    .string "Bad command"

_monitor_loop_command_error:
    jsr newline
    putstr_addr bad_command_string
    jsr newline

    jmp monitor_loop

read_command_temp_string:
    .string "In read command"

read_command_implementation:
    jsr newline
    putstr_addr read_command_temp_string
    jmp _command_exuction_complete

write_command_implementation:
    jmp _command_exuction_complete

jump_command_implementation:
    jmp _command_exuction_complete