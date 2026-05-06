package com.qgichul.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * AI 서버 /api/ai/analysis 응답 매핑.
 * 필드는 FastAPI snake_case 와 1:1 매핑.
 */
@Getter @Setter
public class AiAnalysisResponse {

    /** AI 서버 응답 메인 필드 */
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("weak_units")
    private List<WeakUnit> weakUnits;

    @JsonProperty("overall_feedback")
    private String overallFeedback;

    @JsonProperty("study_priority")
    private List<String> studyPriority;

    /** 호환성: 구버전 프론트가 참조하던 필드 (fallback 용) */
    private String summary;
    private String recommendedStudy;

    @Getter @Setter
    public static class WeakUnit {
        private String unit;

        @JsonProperty("subject_name")
        private String subjectName;

        @JsonProperty("wrong_count")
        private Integer wrongCount;

        @JsonProperty("error_pattern")
        private String errorPattern;

        @JsonProperty("improvement_tip")
        private String improvementTip;
    }
}
