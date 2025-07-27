"use client";
import { useState } from "react";
import { verifyTickets } from "@/utils/ticketVerificationService";
import { Input } from "../ui/input";

export default function TicketVerificationModal({ isOpen, onClose, raffleId }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [verificationResult, setVerificationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const result = await verifyTickets(raffleId, formData);
            setVerificationResult(result);
        } catch (error) {
            setVerificationResult({
                success: false,
                message: "Error al verificar tickets: " + error.message,
                tickets: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-secondary-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-principal-100 border border-principal-400/30 rounded-lg p-5 max-w-md w-full shadow-sm">
                <div className="relative">
                    <h2 className="text-xl font-medium mb-4 text-secondary">
                        Verificar Tickets
                    </h2>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Nombre
                        </label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-principal-200 border-principal-400/30 text-secondary focus:border-accent/50 transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Correo Electrónico
                        </label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-principal-200 border-principal-400/30 text-secondary focus:border-accent/50 transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Teléfono
                        </label>
                        <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="bg-principal-200 border-principal-400/30 text-secondary focus:border-accent/50 transition-colors"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-sm font-medium text-secondary bg-principal-300 rounded border border-principal-400/30 hover:bg-principal-400 transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-1.5 text-sm font-medium text-white bg-accent rounded hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Verificando..." : "Verificar"}
                        </button>
                    </div>
                </form>

                {verificationResult && (
                    <div className="mt-4 border-t border-principal-300/50 pt-4">
                        <p className={`text-sm mb-3 ${verificationResult.success ? "text-accent" : "text-red-500"}`}>
                            {verificationResult.message}
                        </p>
                        {verificationResult.tickets.length > 0 && (
                            <div>
                                <h3 className="text-base font-medium text-secondary mb-3">
                                    Tus tickets:
                                </h3>
                                <div className="space-y-3">
                                    {verificationResult.tickets.map((item, index) => (
                                        <div key={index} 
                                            className="bg-principal-200/80 border border-principal-400/30 p-3 rounded shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-secondary font-medium text-sm">
                                                    {item.raffleName || `Rifa ${item.raffleId}`}
                                                </h4>
                                                <span className="text-accent font-medium text-sm">
                                                    {(item.totalAmount ).toLocaleString('es-CO')} COP
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.tickets.map((ticket, idx) => (
                                                    <span key={idx} 
                                                        className="px-2 py-0.5 bg-principal-300 border border-principal-400/30 rounded text-xs text-secondary"
                                                    >
                                                        {ticket}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}
