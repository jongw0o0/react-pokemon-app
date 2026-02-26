import FilterGroup from './FilterGroup';

const SearchModal = ({ 
    isOpen, 
    onClose, 
    onCardSelect, 
    searchProps // 기존 DeckMaker의 상태값들을 전달받음
}) => {
    if (!isOpen) return null;

    return (
        <div className="search-modal-overlay" onClick={onClose}>
            <div className="search-modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>카드 검색</h2>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </header>

                <div className="modal-body">
                    {/* 이름 검색창 */}
                    <div className="search-input-wrapper">
                        <input 
                            type="text" 
                            placeholder="카드 이름 입력..." 
                            value={searchProps.searchCard}
                            onChange={(e) => searchProps.setSearchCard(e.target.value)}
                        />
                    </div>

                    {/* 이미지 필터 그룹들 */}
                    <div className="filter-section">
                        <FilterGroup 
                            title="에너지 타입"
                            type="types"
                            options={searchProps.TYPES} 
                            activeValue={searchProps.selectedType}
                            onSelect={searchProps.setSelectedType}
                        />
                        <FilterGroup 
                            title="레어도"
                            type="rarities"
                            options={searchProps.RARITIES} 
                            activeValue={searchProps.selectedRarity}
                            onSelect={searchProps.setSelectedRarity}
                        />
                    </div>

                    {/* 카드 결과 리스트 */}
                    <div className="modal-card-list">
                        {searchProps.visibleCards.map(card => (
                            <div key={card.id} className="card-item" onClick={() => {
                                onCardSelect(card);
                                onClose(); // 선택 후 닫기 (선택 사항)
                            }}>
                                <img src={`${card.image}/low.webp`} alt={card.name} />
                                <p>{card.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};