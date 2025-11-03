import { MapPin } from "lucide-react";
import React from "react";

const Location = () => {
  return (
    <div className="flex justify-center items-center mx-auto max-w-[900px] flex-col gap-3">
      <h1 className="font-semibold">Where to find us</h1>
      <p className="text-sm flex items-center gap-2">
        <MapPin /> Mostaganem, Algeria
      </p>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103328.86345745336!2d0.03171747468594804!3d35.970765766711025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1282023e8ae39497%3A0x69337c93a849fab2!2sMostaganem!5e0!3m2!1sfr!2sdz!4v1761978880454!5m2!1sfr!2sdz"
        width="600"
        height="450"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Location;
