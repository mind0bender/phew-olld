import React, { ReactNode } from "react";

function Banner() {
  return (
    <div className="sm:text-xs text-[7px] italic select:font-bold cursor-zoom-in">
      {Array.from(
        `/*********  /****  /****  /********   /****       /****
  /**   /**   /**    /**    /**         /**   /**   /**
   /******     /*********    /****       /**  /****  /**
    /**         /**    /**    /**          /****  /****
    /****       /****  /****  /*******     /****** /******`
      ).map((char: string, idx: number): ReactNode => {
        return (
          <span
            className={`hover:scale-105 duration-100 ${
              char !== " " && "underline"
            }`}
            key={idx}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

export default Banner;
