'use client';

import React from 'react';

interface AdSlotProps {
  type: 'skyscraper-left' | 'skyscraper-right' | 'leaderboard' | 'rectangle';
  className?: string;
  publisherId?: string;
  slotId?: string;
  customHtml?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  className = '',
  publisherId,
  slotId,
  customHtml,
}) => {
  // If custom HTML snippet is provided
  if (customHtml) {
    return (
      <div
        className={`overflow-hidden ${className}`}
        dangerouslySetInnerHTML={{ __html: customHtml }}
      />
    );
  }

  // If real AdSense slot is provided
  if (publisherId && slotId) {
    return (
      <div className={`overflow-hidden text-center my-3 ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // If no real ad is configured yet, render nothing (no placeholders/mock banners)
  return null;
};
