package com.qgichul.backend.service;

import com.qgichul.backend.dto.request.MemoRequest;
import com.qgichul.backend.dto.response.QuestionResponse;
import com.qgichul.backend.entity.*;
import com.qgichul.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final UserAnswerRepository userAnswerRepository;
    private final WrongNoteMemoRepository wrongNoteMemoRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    public List<QuestionResponse> getWrongQuestions(String email) {
        List<UserAnswer> wrongAnswers = userAnswerRepository.findByExamSessionUserEmailAndIsCorrectFalse(email);

        Map<Long, Integer> countByQuestion = new HashMap<>();
        Map<Long, LocalDateTime> latestByQuestion = new HashMap<>();
        Map<Long, Question> questionsById = new LinkedHashMap<>();

        for (UserAnswer ans : wrongAnswers) {
            Long qid = ans.getQuestion().getId();
            countByQuestion.merge(qid, 1, Integer::sum);
            LocalDateTime answeredAt = ans.getAnsweredAt();
            if (answeredAt != null) {
                latestByQuestion.merge(qid, answeredAt, (a, b) -> a.isAfter(b) ? a : b);
            }
            questionsById.putIfAbsent(qid, ans.getQuestion());
        }

        return questionsById.values().stream()
                .map(q -> {
                    QuestionResponse resp = new QuestionResponse(q);
                    resp.setWrongCount(countByQuestion.get(q.getId()));
                    resp.setLastWrongAt(latestByQuestion.get(q.getId()));
                    return resp;
                })
                .sorted(Comparator.comparing(
                        (QuestionResponse r) -> r.getLastWrongAt() == null ? LocalDateTime.MIN : r.getLastWrongAt()
                ).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public String saveOrUpdateMemo(String email, Long questionId, MemoRequest request) {
        WrongNoteMemo existingMemo = wrongNoteMemoRepository.findByUserEmailAndQuestionId(email, questionId).orElse(null);

        if (existingMemo != null) {
            existingMemo.setMemo(request.getMemo());
            wrongNoteMemoRepository.save(existingMemo);
            return "메모가 수정되었습니다.";
        } else {
            User user = userRepository.findByEmail(email).orElseThrow();
            Question question = questionRepository.findById(questionId).orElseThrow();

            WrongNoteMemo newMemo = WrongNoteMemo.builder()
                    .user(user)
                    .question(question)
                    .memo(request.getMemo())
                    .build();
            wrongNoteMemoRepository.save(newMemo);
            return "새 메모가 저장되었습니다.";
        }
    }

    public Map<String, Object> getNoteDetail(String email, Long questionId) {
        Map<String, Object> result = new HashMap<>();
        Question question = questionRepository.findById(questionId).orElseThrow();
        result.put("question", new QuestionResponse(question));
        result.put("memo",
                wrongNoteMemoRepository.findByUserEmailAndQuestionId(email, questionId)
                        .map(WrongNoteMemo::getMemo)
                        .orElse(null));
        return result;
    }
}
