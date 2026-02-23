package com.pokepoke.arch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokepoke.arch.entity.CardLike;

public interface CardLikeRepository extends JpaRepository<CardLike, Long> {

    // 유저가 해당 카드를 이미 좋아요 했는지 확인
    Optional<CardLike> findByMemberIdAndCardId(Long memberId, String cardId);
    
    // 유저별 좋아요 목록 조회
    List<CardLike> findByMemberId(Long memberId);

}
