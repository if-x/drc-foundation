import format from "format-number";
import { CurrencySymbol } from "../../types/currency";

export const toNumber = (
  value: string | number | null | undefined
): number | undefined => (value || value === 0 ? Number(value) : undefined);

interface RoundNumberOptions {
  value?: number;
  round: number;
}

export const roundNumber = ({ value, round }: RoundNumberOptions) => {
  if (value === undefined || value == null) {
    return undefined;
  }

  const roundTimes = Math.pow(10, round);
  return Math.round(value * roundTimes) / roundTimes;
};

interface FormatPercentOptions {
  value?: number | null;
}

export const formatPercent = ({ value }: FormatPercentOptions) => {
  if (value === undefined || value == null) {
    return undefined;
  }

  const formatter = format({
    suffix: "%",
    round: 2,
    padRight: 1,
  });
  return formatter(value);
};

interface FormatSupplyOptions {
  value?: number | null;
}

export const formatSupply = ({ value }: FormatSupplyOptions) => {
  if (value === undefined || value == null) {
    return undefined;
  }

  const formatter = format({
    round: 0,
  });

  return formatter(value);
};

interface FormatNumberOptions {
  value?: number | null;
  prefix?: string;
  suffix?: string;
  round?: number;
  useAbbr?: "long" | "short";
}

export const formatNumber = ({
  value,
  prefix,
  suffix,
  round,
  useAbbr,
}: FormatNumberOptions) => {
  if (value === undefined || value == null) {
    return undefined;
  }

  const valueOption: {
    value: number;
    valueSuffix?: string;
  } = { value };

  if (useAbbr) {
    if (value > 1000) {
      valueOption.value = value / 1000;
      valueOption.valueSuffix = useAbbr === "long" ? "thousand" : "k";
    }
    if (value > 1000000) {
      valueOption.value = value / 1000000;
      valueOption.valueSuffix = useAbbr === "long" ? "million" : "m";
    }
    if (value > 1000000000) {
      valueOption.value = value / 1000000000;
      valueOption.valueSuffix = useAbbr === "long" ? "billion" : "bn";
    }
  }

  const suffixAll = [valueOption.valueSuffix, suffix]
    .filter((s) => s)
    .join(" ");

  const formatter = format({
    prefix,
    suffix: suffixAll !== "" ? ` ${suffixAll}` : undefined,
    round,
    truncate: 20,
  });
  return formatter(valueOption.value);
};

interface RoundCoinPrice {
  value?: number | null;
  round?: number;
}

export const roundCoinPrice = ({
  value,
  round: defaultRound,
}: RoundCoinPrice) => {
  if (value === undefined || value == null) {
    return undefined;
  }

  let round = defaultRound || 2;

  if (value < 1) {
    round = 6;
  }

  if (value < 0.1) {
    round = 8;
  }

  return roundNumber({ value, round });
};

interface FormatCurrencyOptions {
  value?: number | null;
  currency: CurrencySymbol;
  round?: number;
  isAbbr?: boolean;
}

export const formatCurrency = ({
  value,
  currency,
  round,
  isAbbr,
}: FormatCurrencyOptions) => {
  const isFiat =
    currency === CurrencySymbol.USD || currency === CurrencySymbol.CNY;

  return formatNumber({
    value: roundCoinPrice({ value, round }),
    prefix: isFiat ? "$" : undefined,
    suffix: !isFiat ? currency.toUpperCase() : undefined,
    round,
    useAbbr: isAbbr && isFiat ? "short" : undefined,
  });
};

interface FormatBigCurrencyOptions {
  value?: number | null;
  currency: CurrencySymbol;
}

export const formatBigCurrency = ({
  value,
  currency,
}: FormatBigCurrencyOptions) => {
  const isFiat =
    currency === CurrencySymbol.USD || currency === CurrencySymbol.CNY;

  return formatCurrency({
    value: value,
    currency,
    round: isFiat ? 2 : 0,
    isAbbr: true,
  });
};
