import { ExternalLinkIcon } from '@heroicons/react/outline'
import { QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import AuctionCardPrice from 'app/features/miso/AuctionCard/AuctionCardPrice'
import AuctionHeaderSkeleton from 'app/features/miso/AuctionHeader/AuctionHeaderSkeleton'
import AuctionTimer from 'app/features/miso/AuctionTimer'
import { useAuctionContext } from 'app/features/miso/context/AuctionContext'
import { AuctionStatus, AuctionTemplate } from 'app/features/miso/context/types'
import { AuctionHelperTextByTemplateId, AuctionPriceHelperTextByTemplateId } from 'app/features/miso/context/utils'
import { classNames } from 'app/functions'
import { cloudinaryLoader } from 'app/functions/cloudinary'
import Image from 'next/image'
import React, { FC } from 'react'

const AuctionHeader: FC = () => {
  const { i18n } = useLingui()
  const { auction, loading } = useAuctionContext()

  if (loading || !auction) return <AuctionHeaderSkeleton />

  const link = (
    <div
      className={classNames(
        auction.auctionDocuments.website ? 'cursor-pointer' : '',
        'flex gap-3 order-1 md:order-1 items-center lg:justify-start justify-center'
      )}
    >
      {auction.auctionDocuments && auction.auctionDocuments.icon && (
        <div className="min-w-[60px]">
          <Image
            alt="logo"
            src={cloudinaryLoader({ src: auction.auctionDocuments.icon, width: 60 })}
            width={60}
            height={60}
            layout="responsive"
            className="rounded-full shadow-md"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <Typography weight={700} className="text-secondary">
            {auction.auctionToken.symbol}
          </Typography>
        </div>
        <Typography variant="h2" weight={700} className="truncate text-high-emphesis">
          {auction.auctionToken.name}
          {auction.auctionDocuments.website && (
            <ExternalLinkIcon width={20} className="relative inline-flex ml-1 text-high-emphesis" />
          )}
        </Typography>
      </div>
    </div>
  )

  return (
    <div className="grid items-end grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-0">
      {auction.auctionDocuments.website ? (
        <a href={auction.auctionDocuments.website} target="_blank" rel="noreferrer">
          {link}
        </a>
      ) : (
        link
      )}
      <div className="flex justify-center order-3 col-span-1 lg:col-span-1 lg:order-3">
        <AuctionTimer auction={auction}>
          {({ days, hours, minutes, seconds }) => {
            return (
              <div className="grid grid-cols-7 rounded">
                <div className="col-span-7 mb-3">
                  <Typography
                    weight={700}
                    className={classNames(
                      auction.status === AuctionStatus.UPCOMING
                        ? 'text-blue'
                        : auction.status === AuctionStatus.LIVE
                        ? 'text-green'
                        : 'text-pink',
                      'tracking-[0.3em] text-center'
                    )}
                  >
                    {auction.status === AuctionStatus.UPCOMING
                      ? i18n._(t`SALE STARTS IN`)
                      : auction.status === AuctionStatus.LIVE
                      ? i18n._(t`SALE LIVE`)
                      : i18n._(t`SALE FINISHED`)}
                  </Typography>
                </div>
                <Typography variant="h3" weight={700} className="text-center text-white text-mono">
                  {days}
                </Typography>
                <Typography variant="lg" className="text-center text-mono text-low-emphesis">
                  :
                </Typography>
                <Typography variant="h3" weight={700} className="text-center text-white text-mono">
                  {hours}
                </Typography>
                <Typography variant="lg" className="text-center text-mono text-low-emphesis">
                  :
                </Typography>
                <Typography variant="h3" weight={700} className="text-center text-white text-mono">
                  {minutes}
                </Typography>
                <Typography variant="lg" className="text-center text-mono text-low-emphesis">
                  :
                </Typography>
                <Typography variant="h3" weight={700} className="text-center text-white text-mono">
                  {seconds}
                </Typography>
                <Typography variant="xs" weight={700} className="mt-1 text-center text-mono">
                  {i18n._(t`Days`)}
                </Typography>
                <div />
                <Typography variant="xs" weight={700} className="mt-1 text-center text-mono">
                  {i18n._(t`Hours`)}
                </Typography>
                <div />
                <Typography variant="xs" weight={700} className="mt-1 text-center text-mono">
                  {i18n._(t`Minutes`)}
                </Typography>
                <div />
                <Typography variant="xs" weight={700} className="mt-1 text-center text-mono">
                  {i18n._(t`Seconds`)}
                </Typography>
              </div>
            )
          }}
        </AuctionTimer>
      </div>
      <div className="flex justify-center order-2 gap-5 lg:justify-end lg:order-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center lg:justify-end">
            <Typography weight={700} variant="sm" className="text-right text-secondary">
              {auction.template === AuctionTemplate.DUTCH_AUCTION
                ? i18n._(t`Auction Price`)
                : i18n._(t`Current Token Price`)}
            </Typography>
            <QuestionHelper
              text={
                auction.template === AuctionTemplate.DUTCH_AUCTION
                  ? AuctionHelperTextByTemplateId(i18n)[auction.template]
                  : // @ts-ignore TYPE NEEDS FIXING
                    AuctionPriceHelperTextByTemplateId(i18n)[auction.template]
              }
              icon={<SolidQuestionMarkCircleIcon width={12} height={12} className="text-secondary" />}
            />
          </div>

          <div className="flex items-baseline justify-end w-full gap-1">
            {auction.template === AuctionTemplate.DUTCH_AUCTION ? (
              <AuctionCardPrice auction={auction}>
                {/*@ts-ignore TYPE NEEDS FIXING*/}
                {({ price }) => {
                  return (
                    <>
                      <Typography variant="h2" weight={700} className="text-right text-high-emphesis">
                        {price?.toFixed(6)}
                      </Typography>
                      <Typography variant="lg" weight={700} className="text-right">
                        {price?.quoteCurrency.symbol}
                      </Typography>
                    </>
                  )
                }}
              </AuctionCardPrice>
            ) : (
              <>
                <Typography variant="h2" weight={700} className="text-right text-high-emphesis">
                  {auction.tokenPrice?.toSignificant(6)}
                </Typography>
                <Typography variant="lg" weight={700} className="text-right">
                  {auction.tokenPrice?.quoteCurrency.symbol}
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionHeader
