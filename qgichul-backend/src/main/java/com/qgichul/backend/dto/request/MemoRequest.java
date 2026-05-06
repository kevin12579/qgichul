package com.qgichul.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MemoRequest {
    private String memo; // 프론트에서 입력한 텍스트
}