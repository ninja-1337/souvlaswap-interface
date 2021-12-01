import { ArrowDownIcon } from '@heroicons/react/outline'
import { ExclamationIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId, Token } from '@sushiswap/core-sdk'
import limitOrderPairList from '@sushiswap/limit-order-pair-list/dist/limit-order.pairlist.json'
import swapArrowsAnimationData from 'app/animation/swap-arrows.json'
import AddressInputPanel from 'app/components/AddressInputPanel'
import Alert from 'app/components/Alert'
import Button from 'app/components/Button'
import Container from 'app/components/Container'
import DoubleGlowShadow from 'app/components/DoubleGlowShadow'
import ExpertModePanel from 'app/components/ExpertModePanel'
import Typography from 'app/components/Typography'
import BalancePanel from 'app/features/legacy/limit-order/BalancePanel'
import CurrencyInput from 'app/features/legacy/limit-order/CurrencyInput'
import CurrencyInputPanel from 'app/features/legacy/limit-order/CurrencyInputPanel'
import CurrencySelect from 'app/features/legacy/limit-order/CurrencySelect'
import LimitPriceInputPanel from 'app/features/legacy/limit-order/LimitPriceInputPanel'
import OrderExpirationDropdown from 'app/features/legacy/limit-order/OrderExpirationDropdown'
import PayFromToggle from 'app/features/legacy/limit-order/PayFromToggle'
import PriceRatio from 'app/features/legacy/limit-order/PriceRatio'
import ExchangeHeader from 'app/features/trade/Header'
import { formatPercent, maxAmountSpend, tryParseAmount } from 'app/functions'
import NetworkGuard from 'app/guards/Network'
import { useAllTokens, useCurrency } from 'app/hooks/Tokens'
import TokenWarningModal from 'app/modals/TokenWarningModal'
import { useActiveWeb3React } from 'app/services/web3'
import {
  useDefaultsFromURLSearch,
  useDerivedLimitOrderInfo,
  useLimitOrderActionHandlers,
  useLimitOrderState,
} from 'app/state/limit-order/hooks'
import { Field } from 'app/state/swap/actions'
import { useExpertModeManager } from 'app/state/user/hooks'
import Lottie from 'lottie-react'
import Head from 'next/head'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const areEqual = (first, second) => {
  if (first.length !== second.length) {
    return false
  }
  for (let i = 0; i < first.length; i++) {
    if (!second.includes(first[i])) {
      return false
    }
  }
  return true
}

function LimitOrder() {
  const { i18n } = useLingui()
  const { chainId, account } = useActiveWeb3React()

  const loadedUrlParams = useDefaultsFromURLSearch()
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]

  const pairs = (limitOrderPairList.pairs[chainId] || []).map(([token0, token1]) => [token0.address, token1.address])

  // token warning stuff
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)

  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  // for expert mode
  const [isExpertMode, toggleExpertMode] = useExpertModeManager()

  // Limit order state
  const { independentField, typedValue, recipient, limitPrice, fromBentoBalance } = useLimitOrderState()

  // Limit order derived state
  const { currencies, parsedAmounts, walletBalances, bentoboxBalances, currentPrice } = useDerivedLimitOrderInfo()

  // Limit order state handlers
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useLimitOrderActionHandlers()

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const maxAmountInput = maxAmountSpend(walletBalances[Field.INPUT])

  const atMaxAmountInput = Boolean(
    fromBentoBalance
      ? parsedAmounts[Field.INPUT]?.equalTo(bentoboxBalances[Field.INPUT])
      : maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
  )

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    if (fromBentoBalance) {
      onUserInput(Field.INPUT, bentoboxBalances[Field.INPUT].toExact())
    } else {
      maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [bentoboxBalances, fromBentoBalance, maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false)

  const [currencyInputPanelError, setCurrencyInputPanelError] = useState<string>()

  const checkLimitPrice = useCallback(
    (limitPrice) => {
      const parsedLimitPrice = tryParseAmount(
        limitPrice,
        (dependentField === Field.INPUT ? currencies[Field.INPUT] : currencies[Field.OUTPUT]) ?? undefined
      )
      const parsedCurrentPrice = tryParseAmount(
        currentPrice?.toSignificant(6),
        (dependentField === Field.INPUT ? currencies[Field.INPUT] : currencies[Field.OUTPUT]) ?? undefined
      )

      if (parsedLimitPrice?.lessThan(parsedCurrentPrice)) {
        setCurrencyInputPanelError(i18n._(t`This transaction is below market rate`))
      } else {
        setCurrencyInputPanelError('')
      }
    },
    [currencies, currentPrice, dependentField, i18n]
  )

  const currencyInputPanelHelperText = useMemo(() => {
    const parsedLimitPrice = tryParseAmount(
      limitPrice,
      (dependentField === Field.INPUT ? currencies[Field.INPUT] : currencies[Field.OUTPUT]) ?? undefined
    )
    const parsedCurrentPrice = tryParseAmount(
      currentPrice?.toFixed(),
      (dependentField === Field.INPUT ? currencies[Field.INPUT] : currencies[Field.OUTPUT]) ?? undefined
    )

    if (!parsedLimitPrice || !parsedCurrentPrice || parsedLimitPrice.equalTo(parsedCurrentPrice)) return

    const sign = parsedLimitPrice.greaterThan(parsedCurrentPrice) ? i18n._(t`above`) : i18n._(t`below`)
    const pct = ((+limitPrice - +currentPrice?.toSignificant(6)) / +currentPrice?.toSignificant(6)) * 100
    return i18n._(t`${formatPercent(pct)} ${sign} market rate`)
  }, [limitPrice, dependentField, currencies, currentPrice, i18n])

  useEffect(() => {
    if (
      pairs &&
      currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      !pairs.find((el) =>
        areEqual(el, [currencies[Field.INPUT].wrapped.address, currencies[Field.OUTPUT].wrapped.address])
      )
    ) {
      setCurrencyInputPanelError('Invalid pair')
    } else if (currencyInputPanelError === 'Invalid pair') {
      setCurrencyInputPanelError('')
    }
  }, [currencies, currencyInputPanelError, pairs])

  const inputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [pairs])

  const outputTokenList = useMemo(() => {
    if (pairs.length === 0) return []
    if (currencies[Field.INPUT]) {
      return pairs.reduce((acc, [token0, token1]) => {
        if (currencies[Field.INPUT].wrapped.address === token0) acc.push(token1)
        if (currencies[Field.INPUT].wrapped.address === token1) acc.push(token0)
        return acc
      }, [])
    }
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [currencies, pairs])

  return (
    <Container id="limit-order-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>{i18n._(t`Limit order`)} | Sushi</title>
        <meta
          name="description"
          content="SushiSwap allows for swapping of ERC20 compatible tokens across multiple networks"
        />
      </Head>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
      />
      <ExpertModePanel
        active={isExpertMode}
        onClose={() => {
          onChangeRecipient(null)
          toggleExpertMode()
        }}
      >
        <DoubleGlowShadow>
          <div id="limit-order-page" className="flex flex-col gap-4 p-4 rounded bg-dark-900">
            <ExchangeHeader input={currencies[Field.INPUT]} output={currencies[Field.OUTPUT]} />
            <div className="flex flex-col gap-4">
              <CurrencyInputPanel
                className="rounded-t"
                id="swap-currency-input"
                topAdornment={<PayFromToggle />}
                bottomAdornment={<BalancePanel />}
                selectComponent={
                  <CurrencySelect
                    currency={currencies[Field.INPUT]}
                    otherCurrency={currencies[Field.OUTPUT]}
                    label={i18n._(t`You pay`)}
                    onSelect={handleInputSelect}
                    currencyList={inputTokenList}
                    allowManageTokenList={false}
                  />
                }
                inputComponent={
                  <CurrencyInput
                    id="token-amount-input"
                    onMax={handleMaxInput}
                    showMaxButton={!atMaxAmountInput}
                    onUserInput={(value) => onUserInput(Field.INPUT, value)}
                    value={formattedAmounts[Field.INPUT]}
                  />
                }
              />
              <div className="flex flex-row gap-5">
                <div />
                <div className="relative flex items-center">
                  <div className="z-0 absolute w-[2px] bg-dark-800 h-[calc(100%+32px)] top-[-16px] left-[calc(50%-1px)]" />
                  <button
                    className="z-10 rounded-full bg-dark-900 p-3px"
                    onClick={() => {
                      onSwitchTokens()
                    }}
                  >
                    <div
                      className="p-2 rounded-full bg-dark-800 hover:bg-dark-700"
                      onMouseEnter={() => setAnimateSwapArrows(true)}
                      onMouseLeave={() => setAnimateSwapArrows(false)}
                    >
                      <Lottie
                        animationData={swapArrowsAnimationData}
                        autoplay={animateSwapArrows}
                        loop={false}
                        className="w-[32px] h-[32px]"
                      />
                    </div>
                  </button>
                </div>
                <LimitPriceInputPanel onBlur={(val) => checkLimitPrice(val)} />
              </div>
              <CurrencyInputPanel
                className="relative rounded z-1"
                id="swap-currency-input"
                selectComponent={
                  <CurrencySelect
                    disabled={!currencies[Field.INPUT]}
                    currency={currencies[Field.OUTPUT]}
                    otherCurrency={currencies[Field.INPUT]}
                    label={i18n._(t`You receive:`)}
                    onSelect={handleOutputSelect}
                    currencyList={outputTokenList}
                    includeNativeCurrency={false}
                    allowManageTokenList={false}
                  />
                }
                inputComponent={
                  <CurrencyInput
                    id="token-amount-output"
                    showMaxButton={false}
                    onUserInput={(value) => onUserInput(Field.OUTPUT, value)}
                    value={formattedAmounts[Field.OUTPUT]}
                    error={currencyInputPanelError}
                    endAdornment={
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-right text-high-emphesis">
                          {currencyInputPanelHelperText}
                        </span>
                      </div>
                    }
                  />
                }
                bottomAdornment={
                  currencyInputPanelError ? (
                    <div className="z-0 flex items-center justify-center py-2 -mt-2 rounded-b bg-red bg-opacity-20">
                      <div className="flex items-center gap-2 pt-2">
                        <ExclamationIcon className="text-red" width={24} height={24} />
                        <Typography variant="xs" weight={700}>
                          {currencyInputPanelError}
                        </Typography>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )
                }
              />
              {recipient !== null ? (
                <>
                  <div className="relative left-9">
                    <ArrowDownIcon className="text-high-emphesis" strokeWidth={2} width={16} height={16} />
                  </div>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                  {recipient !== account && (
                    <Alert
                      type="warning"
                      dismissable={false}
                      showIcon
                      message={i18n._(
                        t`Please note that the recipient address is different from the connected wallet address.`
                      )}
                    />
                  )}
                </>
              ) : null}
            </div>

            <div className="flex flex-col items-end justify-between w-full gap-4 md:flex-row md:items-center">
              {currencies[Field.INPUT] && currencies[Field.OUTPUT] && (
                <div className="flex flex-1">
                  <PriceRatio />
                </div>
              )}
              {isExpertMode && recipient === null && (
                <div
                  className={`flex flex-1 ${
                    currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'justify-center' : ''
                  }`}
                >
                  <div
                    className="flex items-center text-sm underline cursor-pointer text-blue"
                    onClick={() => onChangeRecipient('')}
                  >
                    {i18n._(t`Change Recipient`)}
                  </div>
                </div>
              )}
              {!(currencies[Field.INPUT] && currencies[Field.OUTPUT]) && !(isExpertMode && recipient === null) && (
                <div className="flex flex-1" />
              )}

              <OrderExpirationDropdown />
            </div>

            <div className="flex flex-col gap-3">
              <Alert
                type="information"
                title="Upgrade Notice"
                message={
                  'In order to incorporate more community filler bots the ability to add new limit orders is temporarily paused. Existing orders are unaffected and can be edited and cancelled at any time'
                }
                dismissable={false}
              />
              <Button disabled={true} color={'gray'}>
                {i18n._(t`Limit Orders Disabled`)}
              </Button>
              {/*<LimitOrderButton color="gradient" className="font-bold" currency={currencies[Field.INPUT]} />*/}
            </div>
          </div>
        </DoubleGlowShadow>
      </ExpertModePanel>
    </Container>
  )
}

LimitOrder.Guard = NetworkGuard([ChainId.MATIC])

export default LimitOrder