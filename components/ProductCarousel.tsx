"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import { ProductImage } from "@/app/generated/prisma";
import "swiper/css";
import "swiper/css/pagination";

const ProductCarousel = ({
  images,
  mainImage,
}: {
  images: ProductImage[];
  mainImage: string;
}) => {
  return (
    <div className="max-w-[500px]">
      <Swiper
        modules={[Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        autoplay
        loop={true}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + "</span>";
          },
        }}
      >
        <SwiperSlide>
          <Image
            className="w-full h-full object-cover"
            src={mainImage}
            alt={mainImage}
            width={100}
            height={100}
          />
        </SwiperSlide>
        {images?.map((image, index) => (
          <SwiperSlide key={image.id}>
            <Image
              className="w-full h-full object-cover"
              src={image.imageUrl}
              alt={image.productId + " " + index || ""}
              width={100}
              height={100}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;
