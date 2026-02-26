const FilterGroup = ({ title, options, activeValue, onSelect, type }) => {
    return (
        <div className="filter-group">
            <label className="filter-label">{title}</label>
            <div className="filter-options">
                {options.map((opt) => {
                    const value = typeof opt === 'object' ? opt.value : opt;
                    const label = typeof opt === 'object' ? opt.label : opt;
                    const isActive = activeValue === value;

                    return (
                        <button
                            key={value}
                            className={`filter-btn ${isActive ? 'active' : ''}`}
                            onClick={() => onSelect(isActive ? 'all' : value)}
                            title={label}
                        >
                            {/* 이미지 경로: /public/assets/icons/types/grass.png 등 */}
                            <img 
                                src={`/assets/icons/${type}/${value.toLowerCase().replace(/\s+/g, '-')}.png`} 
                                alt={label} 
                                onError={(e) => e.target.src = '/assets/icons/default.png'} // 이미지 없을 때 대비
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FilterGroup;