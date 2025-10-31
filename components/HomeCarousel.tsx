"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import { CarouselSlide } from "@/app/generated/prisma";
import { Button } from "./ui/button";
import { Autoplay } from "swiper/modules";
import "swiper/css/autoplay";

const HomeCarousel = ({ slides }: { slides: CarouselSlide[] }) => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000 }}
      spaceBetween={10}
      slidesPerView={"auto"}
      loop={true}
    >
      {slides?.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="flex flex-col h-[400px] items-center justify-center relative">
            <div className="absolute z-1 py-2 pl-2 top-0 bg-black/70 w-full">
              <h1 className="text-lg text-white"> {slide.title} </h1>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                className="absolute z-2 bottom-4 rounded-none bg-white/90"
                variant={"secondary"}
                asChild
              >
                <Link href={slide.linkUrl || "/"}>Shop</Link>
              </Button>

              <Image
                className="w-full h-full absolute object-cover"
                src={slide.imageUrl}
                alt={slide.title || ""}
                width={100}
                height={100}
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeCarousel;
