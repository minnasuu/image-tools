import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_EFFECT_PROJECT_DATA } from "../mock.tsx";
import "../style/index.scss";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const originData = IMG_EFFECT_PROJECT_DATA;
  const [data, setData] = useState<
    {
      id: string;
      title: string;
      desc: string;
      date: string;
      src: string;
      icon: string;
    }[]
  >(originData);
  const [search, setSearch] = useState<string>("");
  return (
    <div className={"width-100 height-100 overflow-auto"}>
      <div
        className={"flex column gap-24 mx-auto width-100 border-box"}
        style={{
          maxWidth: "1248px",
          padding: "88px 24px",
          boxSizing: "border-box",
        }}
      >
        <div className={"flex justify-between mx-auto"}>
          <input
            placeholder={"输入关键词"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              setSearch(val);
              const newData = originData.filter(
                (i) => i.title.includes(val) || i.desc.includes(val)
              );
              setData(newData);
            }}
          />
        </div>
        <div
          style={{
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            maxWidth: "960px",
          }}
          className={"grid gap-20 mx-auto width-100"}
        >
          {data?.map((item, index: number) => (
            <a
              key={item.id ?? index}
              className={"flex column gap-12 cursor-pointer"}
              onClick={() => navigate(`${item.src}`)}
            >
              <div
                      className={"width-100 radius-12 border p-12 border-box overflow-hidden flex both-center"}
                      style={{ aspectRatio: "1" }}
              >
                <img src={item.icon} alt="" className={"width-100 height-100 object-cover"} />
              </div>
              <div className={"flex column gap-8"}>
                {item.title && (
                  <div className={"fs-14 fw-600 color-gray-2"}>
                    {item.title
                      ?.split(search)
                      ?.map((str: string, idx: number) => (
                        <>
                          {idx > 0 && (
                            <span className={"color-primary"}>{search}</span>
                          )}
                          {str}
                        </>
                      ))}
                  </div>
                )}
                {item.desc && (
                  <div
                    className={"width-100 fs-12 color-gray-4 text-line-2"}
                    style={{ minHeight: "36px" }}
                  >
                    {item.desc
                      ?.split(search)
                      ?.map((str: string, idx: number) => (
                        <>
                          {idx > 0 && (
                            <span className={"color-primary"}>{search}</span>
                          )}
                          {str}
                        </>
                      ))}
                  </div>
                )}
                {item.date && (
                  <div className={"fs-12 color-gray-4"}>{item.date}</div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
