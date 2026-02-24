"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Instagram,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Map,
  AdvancedMarker,
  useMapsLibrary,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useData } from "../context/DataContext";
import { formatPhone, getWhatsappLink } from "../utils/businessHelpers";

const LocationSection = () => {
  const { business: businessInfo } = useData();

  // Default to Goiânia center
  const [businessLocation, setBusinessLocation] = useState({
    lat: -16.686891,
    lng: -49.264788,
  });
  const [cameraProps, setCameraProps] = useState({
    center: { lat: -16.686891, lng: -49.264788 },
    zoom: 15,
  });
  const placesLib = useMapsLibrary("places");
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);

  const [formattedAddress, setFormattedAddress] = useState("");
  const [placePhoto, setPlacePhoto] = useState("");

  useEffect(() => {
    if (!placesLib || !businessInfo?.googlePlaceId) return;

    const fetchPlaceDetails = async () => {
      try {
        // Using the New Places Library (v3.56+)
        const place = new placesLib.Place({
          id: businessInfo.googlePlaceId || "",
        });

        const results = await place.fetchFields({
          fields: ["location", "displayName", "formattedAddress", "photos"],
        });

        if (results && results.place) {
          const p = results.place;

          if (p.location) {
            const newPos = {
              lat: p.location.lat() || 0,
              lng: p.location.lng() || 0,
            };
            setBusinessLocation(newPos);
            setCameraProps((prev) => ({ ...prev, center: newPos }));
          }
          if (p.formattedAddress) {
            setFormattedAddress(p.formattedAddress);
          }
          if (p.photos && p.photos.length > 0) {
            // The new API photo object has getURI()
            setPlacePhoto(
              p.photos[0].getURI({ maxWidth: 160, maxHeight: 120 }),
            );
          }
        }
      } catch (err) {
        console.error("Error fetching Place details:", err);
      }
    };

    fetchPlaceDetails();
  }, [placesLib, businessInfo?.googlePlaceId]);

  if (!businessInfo?.googlePlaceId) return null;

  return (
    <section id="location" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header — centered like ReviewsSection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-brand mb-4">
            Onde Estamos
          </h2>
          <p className="hidden md:block text-gray-600 text-lg font-light leading-relaxed max-w-xl mx-auto">
            Venha nos fazer uma visita.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row gap-12 items-center"
        >
          <div className="md:w-1/2 space-y-4 md:space-y-6">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="bg-brand-100 p-3 rounded-full text-brand-600 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                  Endereço
                </h3>
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${businessInfo?.googlePlaceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-brand-600 md:text-gray-600 text-sm md:text-base hover:text-brand-600 transition-colors"
                >
                  <span>{formattedAddress || "Carregando endereço..."}</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 md:hidden" />
                </motion.a>
                {/* Link text only shown on desktop */}
                <span className="hidden md:flex">
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${businessInfo?.googlePlaceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-brand-600 font-medium hover:underline text-sm"
                  >
                    Ver no Google Maps
                  </motion.a>
                </span>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600 flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                  WhatsApp
                </h3>
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href={getWhatsappLink(businessInfo.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-green-600 md:text-gray-600 text-sm md:text-base hover:text-green-600 transition-colors"
                >
                  <span>{formatPhone(businessInfo.phone)}</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 md:hidden" />
                </motion.a>
                {/* Link text only shown on desktop */}
                <span className="hidden md:flex">
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    href={getWhatsappLink(businessInfo.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-green-600 font-medium hover:underline text-sm"
                  >
                    Chamar no WhatsApp
                  </motion.a>
                </span>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-tr from-yellow-100 via-brand-100 to-purple-100 p-3 rounded-full text-brand-600 flex-shrink-0">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                  Instagram
                </h3>
                {/* Description only shown on desktop */}
                <p className="hidden md:block text-gray-600">
                  Acompanhe nossas novidades
                </p>
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href={
                    businessInfo?.instagram
                      ? `https://instagram.com/${businessInfo.instagram}`
                      : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-brand-600 font-medium hover:underline text-sm md:mt-2"
                >
                  Seguir @{businessInfo?.instagram || "instagram"}
                </motion.a>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className="md:w-1/2 w-full h-[400px] bg-gray-100 rounded-3xl overflow-hidden shadow-lg border-4 border-white relative"
          >
            <Map
              {...cameraProps}
              onCameraChanged={(ev) => setCameraProps(ev.detail)}
              mapId="DEMO_MAP_ID"
              disableDefaultUI={false}
              gestureHandling={"cooperative"}
            >
              <AdvancedMarker
                ref={markerRef}
                position={businessLocation}
                onClick={() => setInfoWindowOpen(true)}
              >
                <div className="relative flex flex-col items-center group cursor-pointer">
                  {/* Ripple effect */}
                  <div
                    className="absolute w-12 h-12 rounded-full animate-ping opacity-20"
                    style={{
                      backgroundColor: "var(--color-brand-500)",
                    }}
                  />

                  {/* Pin Body */}
                  <div
                    className="relative z-10 w-11 h-11 rounded-full border-2 border-white shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                    style={{
                      backgroundColor: "var(--color-brand-600)",
                    }}
                  >
                    <MapPin size={22} className="text-white" />
                  </div>

                  {/* Pointer/Tip */}
                  <div
                    className="w-4 h-4 rotate-45 border-r-2 border-b-2 border-white -mt-2 shadow-lg z-0"
                    style={{
                      backgroundColor: "var(--color-brand-600)",
                    }}
                  />
                </div>
              </AdvancedMarker>

              {infoWindowOpen && (
                <InfoWindow
                  anchor={marker}
                  maxWidth={280}
                  onCloseClick={() => setInfoWindowOpen(false)}
                >
                  <div
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      padding: "4px 2px 2px",
                    }}
                  >
                    {/* Photo thumbnail */}
                    {placePhoto && (
                      <img
                        src={placePhoto}
                        alt={businessInfo?.name}
                        style={{
                          width: "72px",
                          height: "72px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--color-brand-700)",
                          fontWeight: 700,
                          marginBottom: "2px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {businessInfo?.name}
                      </p>
                      {formattedAddress && (
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#6b7280",
                            marginBottom: "8px",
                            lineHeight: "1.4",
                          }}
                        >
                          {formattedAddress}
                        </p>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${businessInfo?.googlePlaceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          backgroundColor: "var(--color-brand-600)",
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: "999px",
                          textDecoration: "none",
                        }}
                      >
                        Abrir no Maps ↗
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationSection;
