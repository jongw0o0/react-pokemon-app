package com.pokepoke.arch.entity;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

// import org.hibernate.annotations.DialectOverride.SQLDelete;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString
@Table(name = "deck")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE deck SET is_deleted = 'Y' WHERE deck_id = ?")
@Where(clause = "is_deleted = 'N'")
public class Deck extends BaseEntity  {

    @Id
    @Column(name = "deck_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String deckName;

    @Column(nullable = false)
    private String deckComment;

    private String representativeCardId;

    private String representativeImageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeckCard> deckCards = new ArrayList<>();

    @Column(name = "is_deleted", nullable = false)
    private String isDeleted = "N";

    public static Deck createDeck(String deckName, String deckComment, String representativeCardId,
                                String representativeImageUrl, Member member) {
        Deck deck = new Deck();
        deck.deckName = deckName;
        deck.deckComment = deckComment;
        deck.representativeCardId = representativeCardId;
        deck.representativeImageUrl = representativeImageUrl;
        deck.member = member;
        return deck;
    }

    public void updateDeck(String deckName, String deckComment,
                                  String representativeCardId, String representativeImageUrl) {
        this.deckName = deckName;
        this.deckComment = deckComment;
        this.representativeCardId = representativeCardId;
        this.representativeImageUrl = representativeImageUrl;
    }

    public void clearCards() {
        this.deckCards.clear();
    }

    public String getRepresentativeCardId() {
        if (this.representativeCardId != null && !this.representativeCardId.isEmpty()) {
            return this.representativeCardId;
        }
        if (this.deckCards != null && !this.deckCards.isEmpty()) {
            return this.deckCards.get(0).getApiCardId();
        }
        return null;
    }

    public String getRepresentativeImageUrl() {
        if (this.representativeImageUrl != null && !this.representativeImageUrl.isEmpty()) {
            return this.representativeImageUrl;
        }

        if (this.deckCards != null && !this.deckCards.isEmpty()) {
            String cardId = this.deckCards.get(0).getApiCardId();

            int lastIndex = cardId.lastIndexOf("-");
            String formattedPath = (lastIndex != -1)
                    ? cardId.substring(0, lastIndex) + "/" + cardId.substring(lastIndex + 1)
                    : cardId;

            return "https://assets.tcgdex.net/en/tcgp/" + formattedPath + "/low.png";
        }

        // 카드조차 없다면 기본 이미지 반환
        return "https://assets.tcgdex.net/en/tcgp/B1/1/low.png";
    }

    // 덱 서비스에서 덱 저장 위해 필요한 메서드
    public void setFinalRepresentativeInfo() {
        this.representativeCardId = this.getRepresentativeCardId();
        this.representativeImageUrl = this.getRepresentativeImageUrl();
    }

}
