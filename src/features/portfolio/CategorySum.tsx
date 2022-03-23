import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import Typography from 'app/components/Typography'
import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { currencyFormatter } from 'app/functions'
import { useRouter } from 'next/router'
import React from 'react'

interface CategorySumProps {
  title: string
  subtitle?: string
  assetAmounts: CurrencyAmount<Currency>[]
  liabilityAmounts?: CurrencyAmount<Currency>[]
  loading?: boolean
  route: string
}

export const CategorySum = ({ title, subtitle, assetAmounts, liabilityAmounts, route }: CategorySumProps) => {
  const router = useRouter()

  return (
    <SumUSDCValues amounts={assetAmounts}>
      {({ amount: assetAmount }) => (
        <SumUSDCValues amounts={liabilityAmounts}>
          {({ amount: liabilityAmount }) => {
            return (
              <div onClick={() => router.push(route)}>
                <div className="flex justify-between p-4 transition-colors border rounded border-dark-900 hover:bg-dark-800 hover:cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Typography weight={700} variant="lg" className="text-high-emphesis">
                      {title}
                    </Typography>
                    {subtitle && (
                      <Typography weight={700} variant="sm" className="text-low-emphesis">
                        {subtitle}
                      </Typography>
                    )}
                  </div>
                  <Typography variant="lg" weight={400} className="text-high-emphesis">
                    {assetAmount && liabilityAmount
                      ? currencyFormatter.format(Number(assetAmount.subtract(liabilityAmount).toExact()))
                      : assetAmount
                      ? currencyFormatter.format(Number(assetAmount.toExact()))
                      : '$0.00'}
                  </Typography>
                </div>
              </div>
            )
          }}
        </SumUSDCValues>
      )}
    </SumUSDCValues>
  )
}
