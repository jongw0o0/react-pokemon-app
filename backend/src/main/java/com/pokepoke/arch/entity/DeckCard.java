package com.pokepoke.arch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString
@Table(name = "deckCard")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DeckCard {

    @Id
    @Column(name = "deck_card_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TCGDex API의 카드 고유 ID (예: "swsh1-1")
    @Column(nullable = false)
    private String apiCardId; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id")
    private Deck deck;

    public static DeckCard createDeckCard(Deck deck, String apiCardId) {
        DeckCard deckCard = new DeckCard();
        deckCard.deck = deck;
        deckCard.apiCardId = apiCardId;
        return deckCard;
    }
}
