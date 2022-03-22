import { CurrencyAmount, Token } from 'souvlaswap-core-sdk'

type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token>>
