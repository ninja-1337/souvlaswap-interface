import SumUSDCValues from 'app/features/trident/SumUSDCValues'
import { classNames } from 'app/functions'
import React, { FC } from 'react'
import { Pair } from 'souvlaswap-core-sdk'

interface PoolValueProps {
  pair: Pair
  roundedBottom?: boolean
}

export const PoolValueEstimation: FC<PoolValueProps> = ({ pair, roundedBottom }) => (
  <div className={classNames('flex items-center justify-between p-3 bg-dark-800', roundedBottom && 'rounded-b')}>
    <div>
      <div>
        {pair.reserve0.toFixed(2)} {pair.token0.symbol}
      </div>
      <div>
        {pair.reserve1.toFixed(2)} {pair.token1.symbol}
      </div>
    </div>
    <SumUSDCValues amounts={[pair.reserve0, pair.reserve1]}>
      {({ amount }) => {
        return <div className="font-bold text-high-emphesis">≈ ${amount?.toFixed(2)}</div>
      }}
    </SumUSDCValues>
  </div>
)
