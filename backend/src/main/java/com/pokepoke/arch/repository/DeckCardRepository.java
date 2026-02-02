package com.pokepoke.arch.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokepoke.arch.entity.DeckCard;

public interface DeckCardRepository extends JpaRepository<DeckCard, Long> {

}
