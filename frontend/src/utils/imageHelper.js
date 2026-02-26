export const handleImageError = (e) => {
    // 엑박 떴을 때 대체할 이미지 경로
    e.target.src = "https://assets.tcgdex.net/en/tcgp/P-A/026/low.png";
    
    // 무한 루프 방지
    e.target.onerror = null; 
};