import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedTicketGrid = memo(({
  totalTickets,
  reservedTickets,
  soldTickets,
  selectedTickets,
  onTicketClick,
  highlightedTicket,
  isDashboard
}) => {
  const parentRef = useRef(null);
  
  const COLUMNS = 10;
  const ROW_HEIGHT = 40;
  const ROWS = Math.ceil(totalTickets / COLUMNS);

  const rowVirtualizer = useVirtualizer({
    count: ROWS,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  const normalizeTicketNumber = (number) => {
    return number.toString().padStart(4, '0');
  };

  return (
    <div 
      ref={parentRef}
      className="h-[600px] overflow-auto scroll-smooth"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const startIndex = virtualRow.index * COLUMNS;
          
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${ROW_HEIGHT}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-10 gap-2"
            >
              {Array.from({ length: COLUMNS }, (_, i) => {
                const ticketNumber = startIndex + i;
                if (ticketNumber >= totalTickets) return null;

                const formattedNumber = normalizeTicketNumber(ticketNumber);
                const isReserved = reservedTickets.includes(ticketNumber);
                const isSold = soldTickets.includes(ticketNumber);
                const isSelected = selectedTickets.includes(ticketNumber);
                const isHighlighted = highlightedTicket === ticketNumber;

                return (
                  <button
                    key={ticketNumber}
                    id={`ticket-${ticketNumber}`}
                    onClick={() => onTicketClick(ticketNumber)}
                    disabled={!isDashboard && (isReserved || isSold)}
                    className={`
                      p-2 text-center border rounded
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${isHighlighted ? 'ring-4 ring-primary ring-opacity-75' : ''}
                      ${
                        isReserved
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : isSold
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }
                    `}
                  >
                    {formattedNumber}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualizedTicketGrid.displayName = 'VirtualizedTicketGrid';
export default VirtualizedTicketGrid; 