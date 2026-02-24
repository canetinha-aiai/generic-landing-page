"use client";

import React, { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useData } from "../context/DataContext";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url: string;
  relative_time_description: string;
}

const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 120;
  const shouldTruncate = review.text.length > MAX_LENGTH;

  const displayedText =
    isExpanded || !shouldTruncate
      ? review.text
      : `${review.text.substring(0, MAX_LENGTH)}...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-2xl transition-shadow duration-300 border border-brand-50 flex flex-col h-full cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={review.profile_photo_url}
            alt={review.author_name}
            className="w-10 h-10 rounded-full object-cover border border-brand-100"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-bold text-sm text-gray-800">
              {review.author_name}
            </h3>
            <div className="flex gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={`${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <Quote className="text-brand-100 w-8 h-8 flex-shrink-0" />
      </div>

      <div className="flex-grow mb-4">
        <p className="text-gray-600 text-sm italic leading-relaxed">
          "{displayedText}"
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-brand-600 text-xs font-bold mt-2 hover:underline focus:outline-none"
          >
            {isExpanded ? "Ler menos" : "Ler mais"}
          </button>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-50 text-xs text-gray-400">
        {review.relative_time_description}
      </div>
    </motion.div>
  );
};

const ReviewsSection = () => {
  const { business: businessInfo } = useData();
  const PLACE_ID = businessInfo?.googlePlaceId;
  const [reviews, setReviews] = useState<Review[]>([]);

  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !PLACE_ID) return;

    const fetchReviews = async () => {
      try {
        const place = new (placesLib as any).Place({
          id: PLACE_ID,
        });

        const results = await (place as any).fetchFields({
          fields: ["rating", "userRatingCount", "reviews"],
        });

        if (results && results.place) {
          const p = results.place;
          setRating(p.rating || 0);
          setTotalReviews(p.userRatingCount || 0);

          const normalizedReviews: Review[] = (p.reviews || [])
            .filter((r: any) => (r.rating || 0) >= 4)
            .slice(0, 4)
            .map((r: any) => ({
              author_name: r.authorAttribution?.displayName || "Cliente",
              rating: r.rating || 5,
              text: r.text || r.relativePublishTimeDescription || "",
              profile_photo_url:
                r.authorAttribution?.photoURI ||
                `https://ui-avatars.com/api/?name=${r.authorAttribution?.displayName || "C"}&background=random`,
              relative_time_description:
                r.relativePublishTimeDescription || "Recentemente",
            }));

          setReviews(normalizedReviews);
        } else {
          console.error("Places API Error: No results found");
          setError("Não foi possível carregar as avaliações no momento.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Place details:", err);
        setError("Erro ao conectar com o Google Maps.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [placesLib, businessInfo?.googlePlaceId]);

  // Function to render stars
  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`${i <= score ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />,
      );
    }
    return stars;
  };

  if (!PLACE_ID) return null;
  if (!loading && reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-20 bg-brand-50/20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 font-brand mb-4">
            O que dizem sobre nós
          </h2>

          {loading ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-800">
                  {rating}
                </span>
                <div className="flex gap-1">
                  {renderStars(Math.round(rating))}
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Baseado em {totalReviews} avaliações no Google
              </p>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm h-48 animate-pulse"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              reviews.length === 1
                ? "grid-cols-1 max-w-md mx-auto"
                : reviews.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                  : reviews.length === 3
                    ? "grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`https://search.google.com/local/reviews?placeid=${PLACE_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-600 font-bold hover:bg-brand-50 px-6 py-3 rounded-full transition-colors"
          >
            <Star size={18} />
            Ver todas as avaliações no Google
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
