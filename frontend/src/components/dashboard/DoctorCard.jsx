import React from 'react';

const DoctorCard = ({ doctor, onBook }) => {
  const { name, specialty, rating, experience, image, diseases, availability } = doctor;

  return (
    <div className="border theme-border hover:border-teal-500 rounded-2xl p-5 transition-all duration-300 group card-hover shadow-sm hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff&size=128`}
            alt={name}
            className="w-16 h-16 rounded-xl object-cover border-2 theme-border group-hover:border-teal-50 dark:group-hover:border-teal-900 transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 theme-surface rounded-full"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-black theme-text text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{name}</h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
              <span className="text-yellow-500 text-xs">★</span>
              <span className="text-yellow-700 dark:text-yellow-500 text-xs font-bold">{rating}</span>
            </div>
          </div>
          <p className="text-teal-600 dark:text-teal-400 text-xs font-black mt-0.5 uppercase tracking-wide">{specialty}</p>
          <p className="theme-text-sub text-[10px] font-bold mt-1.5 flex items-center gap-1 uppercase tracking-wider">
            <span>📅 {experience} YRS EXP.</span>
            <span>•</span>
            <span className={availability === 'Available' ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}>{availability}</span>
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] uppercase tracking-widest theme-text-sub font-black mb-2.5 px-0.5">Specializes in</p>
        <div className="flex flex-wrap gap-1.5">
          {diseases.map((disease, idx) => (
            <span key={idx} className="px-2.5 py-1 theme-text rounded-lg text-[10px] font-black uppercase tracking-tighter border theme-border">
              {disease}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t theme-border flex items-center justify-between">
        <div className="text-[11px] theme-text-sub font-black uppercase tracking-widest">
          Consult: <span className="theme-text font-black text-sm">$50</span>
        </div>
        <button 
          onClick={() => onBook && onBook(doctor)}
          className="bg-gray-900 dark:bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-teal-500/10"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
