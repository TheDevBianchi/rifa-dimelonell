"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Calendar, Tag, CreditCard } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PromoDisplay } from "./PromoDisplay";

// Función para formatear precios en COP
const formatCOP = (price) => {
  return `COP ${price.toLocaleString('es-CO')}`;
};

export function RaffleDetails({ raffle }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = raffle.images;

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="max-w-4xl mx-auto bg-principal-200 overflow-hidden rounded-2xl border border-principal-400/30 shadow-md">
      {/* Carrusel de imágenes */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="relative h-[450px]">
                    <Image
                      src={`${image}`}
                      alt={`${raffle.title} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 to-transparent"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-[0_0_100%] min-w-0">
                <div className="relative h-[450px] bg-secondary-800/20 flex items-center justify-center">
                  <span className="text-secondary-700">
                    No hay imágenes disponibles
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controles del carrusel */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-principal-100 p-2 rounded-full 
          hover:bg-accent/10 hover:border-accent transition-all duration-300 border border-principal-400/30"
        >
          <ChevronLeft className="w-5 h-5 text-secondary" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-principal-100 p-2 rounded-full 
          hover:bg-accent/10 hover:border-accent transition-all duration-300 border border-principal-400/30"
        >
          <ChevronRight className="w-5 h-5 text-secondary" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
          {raffle.images &&
            raffle.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "bg-accent" : "bg-secondary/30"
                }`}
              />
            ))}
        </div>
      </div>
      {/* Información de la rifa */}
      <div className="p-6 space-y-6 bg-principal-100">
        <h1 className="text-3xl font-medium text-center mb-2 text-secondary">
          {raffle.title}
        </h1>
        <div className="bg-principal-50 p-5 rounded-lg border border-principal-400/20 shadow-sm">
          <p className="text-secondary-700 leading-relaxed whitespace-pre-line">
            {raffle.description}
          </p>
        </div>
        {/* Grid de información con hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-principal-50 p-4 rounded-lg border border-principal-400/20 hover:border-accent/20 transition-all duration-300 hover:shadow-sm">
            <h3 className="text-lg font-medium text-secondary mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-accent" />
              Detalles de la Rifa
            </h3>
            <div className="space-y-2">
              <p className="flex justify-between items-center">
                <span className="text-secondary-700">Precio por ticket:</span>
                <span className="text-xl font-medium text-accent">
                  {formatCOP(raffle.price)}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-secondary-700">Tickets mínimos:</span>
                <span className="text-secondary-600">{raffle.minTickets}</span>
              </p>
              
              {/* Promociones disponibles */}
              <div className="mt-3 pt-3 border-t border-principal-400/20">
                <h4 className="text-base font-medium text-secondary mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-accent" />
                  Promociones Disponibles
                </h4>
                <PromoDisplay raffleId={raffle.id} ticketPrice={raffle.price} />
              </div>
            </div>
          </div>

          <div className="bg-principal-50 p-4 rounded-lg border border-principal-400/20 hover:border-accent/20 transition-all duration-300 hover:shadow-sm">
            <h3 className="text-lg font-medium text-secondary mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Fechas Importantes
            </h3>
            <div className="space-y-2">
              <p className="flex justify-between items-center">
                <span className="text-secondary-700">Inicio:</span>
                <span className="text-secondary-600">
                  {raffle.startDate ? formatDate(raffle.startDate) : 'Fecha no disponible'}
                </span>
              </p>
              <p className="flex justify-between items-center">
                <span className="text-secondary-700">Finalización:</span>
                <span className="text-secondary-600">
                  {raffle.endDate ? formatDate(raffle.endDate) : 'Aún no está definida'}
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* Barra de progreso minimalista */}
        <div className="space-y-3 bg-principal-50 p-4 rounded-lg border border-principal-400/20 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-medium text-secondary">
              Progreso del Sorteo
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-medium text-accent">
                {Number((((raffle.totalTickets - raffle.availableNumbers) /
                    raffle.totalTickets) *
                    100).toFixed(0))}
                %
              </span>
              <span className="text-secondary-600 text-xs">completado</span>
            </div>
          </div>
          <div className="h-4 bg-principal-300/50 rounded-full overflow-hidden border border-principal-400/20 relative">
            <div
              className="h-full bg-accent transition-all duration-500 ease-out rounded-full relative"
              style={{
                width: `${
                  ((raffle.totalTickets - raffle.availableNumbers) /
                    raffle.totalTickets) *
                  100
                }%`,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_30%,rgba(255,255,255,0)_50%)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
