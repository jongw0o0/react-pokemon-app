package com.pokepoke.arch.entity;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString; 

@Entity
@Getter
@Table(name = "deck_card")
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE deck_card SET is_deleted = 'Y' WHERE deck_card_id = ?")
@Where(clause = "is_deleted = 'N'")
public class DeckCard extends BaseEntity {

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

    @Column(name = "is_deleted", nullable = false)
    private String isDeleted = "N";

    public static DeckCard createDeckCard(Deck deck, String apiCardId) {
        DeckCard deckCard = new DeckCard();
        deckCard.deck = deck;
        deckCard.apiCardId = apiCardId;
        return deckCard;
    }
}
