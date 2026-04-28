package com.jakey.ai.email.writer;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
