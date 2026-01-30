const TiltCard = ({ card }) => {

    const [style, setStyle] = useState({});

    const handleMouseMove = (e) => {
        const { offsetWidth: width, offsetHeight: height } = e.currentTarget;
        const {offsetX: x, offsetY: y} = e.nativeEvent;  

        // 회전 값 계산 (중심을 0으로 잡기 위해 -0.5를 곱함)
        const rotateX = ((y / height) - 0.5) * 30; // 최대 15도 회전
        const rotateY = ((x / width) - 0.5) * -30;

        // 배경(빛 효과) 위치 계산
        const bgX = (x / width) * 100;
        const bgY = (y / height) * 100;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            backgroundPosition: `${bgX}% ${bgY}%`,
        });
    };

    const handleMouseLeave = () => {
        // 마우스가 떠나면 원래대로 복구
        setStyle({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
            transition: "all 0.5s ease"
        });
    };

    return;

}

export default TiltCard;