import React from 'react';

const DoctorCard = ({ doctor }) => {
  const { name, specialty, rating, experience, image, diseases, availability } = doctor;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-teal-100 transition-all duration-300 group card-hover">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff&size=128`}
            alt={name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-gray-50 group-hover:border-teal-50 transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base group-hover:text-teal-700 transition-colors">{name}</h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-yellow-700 text-xs font-bold">{rating}</span>
            </div>
          </div>
          <p className="text-teal-600 text-xs font-semibold mt-0.5">{specialty}</p>
          <p className="text-gray-400 text-[11px] mt-1 flex items-center gap-1">
            <span>📅 {experience} Years Exp.</span>
            <span>•</span>
            <span className={availability === 'Available' ? 'text-green-600' : 'text-orange-500'}>{availability}</span>
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Specializes in</p>
        <div className="flex flex-wrap gap-1.5">
          {diseases.map((disease, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[10px] font-medium border border-gray-100">
              {disease}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="text-[11px] text-gray-500">
          Fee: <span className="text-gray-900 font-bold">$50</span>
        </div>
        <button className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-teal-600 transition-all active:scale-95">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
