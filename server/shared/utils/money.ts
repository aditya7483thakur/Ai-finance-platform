const SCALE = 4;
const FACTOR = 10 ** SCALE;

const toScaledInteger = (raw: string): bigint => {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(-)?(\d+)(?:\.(\d+))?$/);

  if (!match) {
    throw new Error(`Invalid money value: ${raw}`);
  }

  const sign = match[1] === "-" ? -1n : 1n;
  const whole = BigInt(match[2]);
  const fraction = (match[3] ?? "").padEnd(SCALE, "0").slice(0, SCALE);

  return sign * (whole * BigInt(FACTOR) + BigInt(fraction || "0"));
};

const fromScaledInteger = (scaled: bigint): string => {
  const negative = scaled < 0n;
  const absolute = negative ? -scaled : scaled;
  const whole = absolute / BigInt(FACTOR);
  const fraction = (absolute % BigInt(FACTOR)).toString().padStart(SCALE, "0");
  const normalized = `${whole}.${fraction}`.replace(/\.?0+$/, "") || "0";

  return negative && normalized !== "0" ? `-${normalized}` : normalized;
};

export class Money {
  private constructor(private readonly scaled: bigint) {}

  static zero(): Money {
    return new Money(0n);
  }

  static fromString(raw: string): Money {
    return new Money(toScaledInteger(raw));
  }

  static fromNumber(raw: number): Money {
    if (!Number.isFinite(raw)) {
      throw new Error(`Invalid money value: ${raw}`);
    }

    return Money.fromString(raw.toFixed(SCALE));
  }

  add(other: Money): Money {
    return new Money(this.scaled + other.scaled);
  }

  subtract(other: Money): Money {
    return new Money(this.scaled - other.scaled);
  }

  multiply(factor: string | number): Money {
    const multiplier =
      typeof factor === "number"
        ? Money.fromNumber(factor)
        : Money.fromString(factor);

    return new Money((this.scaled * multiplier.scaled) / BigInt(FACTOR));
  }

  isNegative(): boolean {
    return this.scaled < 0n;
  }

  isLessThan(other: Money): boolean {
    return this.scaled < other.scaled;
  }

  clampNonNegative(): Money {
    return this.isNegative() ? Money.zero() : this;
  }

  toString(): string {
    return fromScaledInteger(this.scaled);
  }

  toNumber(): number {
    return Number(this.toString());
  }
}
