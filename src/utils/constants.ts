


// Categorias de despesas
export const EXPENSE_TYPES = [
    "alimentação",
    "educação",
    "lazer",
    "assinatura",
    "moradia",
    "transporte",
    "outros",
] as const;

// Categorias de receitas
export const INCOME_TYPES = [
    "Salário",
    "Investimentos",
    "Freelance",
    "Venda",
    "Reembolso",
    "Outros",
] as const;

// Limites de alerta por tipo
export const ALERT_THRESHOLDS: Record<string, number> = {
    alimentação: 500,
    transporte: 300,
    lazer: 200,
};

// Meses por extenso
export const MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

// Estilo de cores para gráficos (reutilizável)
export const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#a0522d",
    "#8a2be2",
    "#00ced1",
    "#ff1493",
    "#2e8b57",
    "#ff6347",
    "#20b2aa",
    "#9370db",
];
