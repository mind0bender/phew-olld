import React, { FC, ReactNode } from "react";

const Banner: FC = () => {
  return (
    <span className="flex gap-1 sm:text-xs text-[7px] italic select:font-bold">
      <BannerLetter
        letter={`/********* 
  /**   /**
   /****** 
    /**    
    /****  `}
      />
      <BannerLetter
        letter={`/****  /****   
 /**    /**    
  /*********   
   /**    /**  
   /****  /****`}
      />
      <BannerLetter
        letter={`/********  
  /**      
   /****   
    /**    
   /*******`}
      />
      <BannerLetter
        letter={`/****       /****  
  /**   /**   /**  
   /**  /****  /** 
     /****  /****  
    /****** /******`}
      />
    </span>
  );
};

interface BannerLetterData {
  letter: string;
}

const BannerLetter: FC<BannerLetterData> = ({ letter }: BannerLetterData) => {
  return (
    <span>
      {[...Array.from(letter.split("\n"))].map(
        (line: string, idx1: number): ReactNode => {
          return (
            <div key={idx1}>
              {[...Array.from(line)].map(
                (char: string, idx2: number): ReactNode => {
                  return (
                    <span
                      className={`${char !== " " && "underline"}`}
                      key={idx2}
                    >
                      {char}
                    </span>
                  );
                }
              )}
            </div>
          );
        }
      )}
    </span>
  );
};

export default Banner;