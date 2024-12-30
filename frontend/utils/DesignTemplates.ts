const designTemplates = {
    horizontal: {
        layout: (nodes: any[]) =>
            nodes.map((node, i) => ({
                ...node,
                position: { x: i * 250, y: 200 },
            })),
        style: {
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
            border: '1px solid #e2e8f0',
            color: '#1a202c',
            fontFamily: 'Arial, sans-serif',
            transition: 'all 0.3s ease-in-out',
        },
        edgeType: 'smoothstep',
    },
    verticalTimeline: {
        layout: (nodes: any[]) =>
            nodes.map((node, i) => ({
                ...node,
                position: { x: 200, y: i * 150 },
            })),
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            padding: '75px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, #fff7ed, #fb923c)',
            border: '2px solid #fb923c',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            color: '#1a202c',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            transition: 'transform 0.3s ease',
        },
        edgeType: 'step',
    },
    circularFlow: {
        layout: (nodes: any[]) => {
            const radius = 300;
            const angleStep = (2 * Math.PI) / nodes.length;
            return nodes.map((node, i) => ({
                ...node,
                position: {
                    x: 400 + radius * Math.cos(i * angleStep),
                    y: 400 + radius * Math.sin(i * angleStep),
                },
            }));
        },
        style: {
            borderRadius: '16px',
            padding: '20px',
            width: 'fit-content',
            height: 'fit-content',
            background: 'linear-gradient(145deg, #67e8f9, #3b82f6)',
            border: '2px solid #3b82f6',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            fontWeight: '500',
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer',
        },
        edgeType: 'default',
    },
};

export default designTemplates;
