import { memo, useEffect, useRef } from "react"
import styles from "./time.module.css"
import "../../main.css"

const TimePicker = memo(({ callback }) => {

       const selectors = useRef(null);
       const fromSelector = useRef(null);
       const toSelector = useRef(null);
       const container = useRef(null);
       const from = useRef(null);
       const to = useRef(null);
       const fromHoursList = useRef(null);
       const fromMinuteList = useRef(null);
       const toHoursList = useRef(null);
       const toMinuteList = useRef(null);
       const fromMinAndHour = useRef({
              min: 0,
              hour: 0
       });
       const toMinAndHour = useRef({
              min: 0,
              hour: 0
       });


       function createTimeList(element, range, forWhat, step = 1) {
              for (let i = 0; i < range; i += step) {
                     const li = document.createElement("li");
                     li.textContent = i.toString().padStart(2, "0");
                     li.classList.add(forWhat)
                     li.addEventListener("click", () => selectItem(element, li));
                     element.appendChild(li);
              }
              selectItem(element, element.children[0]); // default : 00:00
       }
       function selectItem(parent, item) {
              Array.from(parent.children).forEach(li => li.classList.remove("selected"));
              item.classList.add("selected");
              if (item.classList.contains("fromMinutes")) fromMinAndHour.current.min = item.textContent
              if (item.classList.contains("fromHours")) fromMinAndHour.current.hour = item.textContent
              if (item.classList.contains("toMinutes")) toMinAndHour.current.min = item.textContent
              if (item.classList.contains("toHours")) toMinAndHour.current.hour = item.textContent
              const index = Array.from(parent.children).indexOf(item);
              parent.style.transform = `translateY(${-index * 64}px)`;
       }
       function scrollHandler(event, element) {
              // event.preventDefault();
              let items = Array.from(element.children);
              let selectedIndex = items.findIndex(li => li.classList.contains("selected"));

              if (event.deltaY > 0 || event.key === "ArrowDown") {
                     if (selectedIndex < items.length - 1) selectItem(element, items[selectedIndex + 1]);
              } else if (event.deltaY < 0 || event.key === "ArrowUp") {
                     if (selectedIndex > 0) selectItem(element, items[selectedIndex - 1]);
              }
       }
       function checkDates() {
              const report = {
                     body: "EVERY THING IS FINE",
                     status: true
              };
              const firstDate = new Date(`2025-01-01T${fromMinAndHour.current.hour}:${fromMinAndHour.current.min}`)
              const secondDate = new Date(`2025-01-01T${toMinAndHour.current.hour}:${toMinAndHour.current.min}`)
              if (secondDate <= firstDate) {
                     report.body = "\'FROM\' SHOULD LESS THEN \'TO\' , OR NOT EQUAL";
                     report.status = false;
                     return report;
              }
              return report;
       }

       const fadeToggle = (hidding, showing, StyleDisplayShowing = "block") => {
              let hiddingElem;
              let showingElem;
              if (hidding && showing) {
                     hiddingElem = hidding.current
                     showingElem = showing.current
              } else {
                     console.warn("EMPTY FADING ?!")
                     return false;
              }
              hiddingElem.style.transition = "all 300ms ease";
              hiddingElem.style.opacity = 0;
              setTimeout(() => {
                     hiddingElem.style.display = "none";
                     showingElem.style.display = StyleDisplayShowing
                     showingElem.style.opacity = 0;
                     showingElem.style.transition = "all 200ms ease";
                     setTimeout(() => showingElem.style.opacity = 1, 100);
              }, 200);
       }

       const approvedFromTime = () => {
              fadeToggle(from, selectors, "flex");
              fromSelector.current.textContent = `${fromMinAndHour.current.hour}:${fromMinAndHour.current.min}`
       }
       const approvedToTime = () => {
              fadeToggle(to, selectors, "flex");
              toSelector.current.textContent = `${toMinAndHour.current.hour}:${toMinAndHour.current.min}`
       }

       const ok = () => {
              //EVERYTHING OK...
              const message = checkDates();
              if (!message.status) {
                     console.error(message.body);
                     return;
              }
              callback({
                     from: `${fromMinAndHour.current.hour}:${fromMinAndHour.current.min}`,
                     to: `${toMinAndHour.current.hour}:${toMinAndHour.current.min}`
              });
       }

       useEffect(() => {
              createTimeList(fromHoursList.current, 24, "fromHours");
              createTimeList(fromMinuteList.current, 60, "fromMinutes");
              createTimeList(toHoursList.current, 24, "toHours");
              createTimeList(toMinuteList.current, 60, "toMinutes");
       }, [])

       return (
              <>
                     <section className="w-full select-none" style={{ fontFamily: "cursive" }}>
                            <div className="w-full relative" ref={container}>
                                   {/* selectors */}
                                   <div className="w-full py-4 flex justify-center items-center px-6 gap-x-4 relative mb-10" ref={selectors}>
                                          <div className="w-full border border-neutral-300 px-6 py-3 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative" onClick={() => fadeToggle(selectors, from, "flex")}>
                                                 <h6 className="inline text-neutral-800 bg-white absolute left-2 -bottom-2 text-xs">FROM</h6>
                                                 <p ref={fromSelector}>00:00</p>
                                          </div>
                                          <div className="w-full border border-neutral-300 px-6 py-3 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative" onClick={() => fadeToggle(selectors, to, "flex")}>
                                                 <h6 className="inline text-neutral-800 bg-white absolute left-2 -bottom-2 text-xs">TO</h6>
                                                 <p ref={toSelector}>00:00</p>
                                          </div>
                                          <button className="w-9/10 px-2 py-1 mx-12 text-xs border absolute -bottom-12 rounded-md text-center bg-green-100 cursor-pointer" onClick={ok}>
                                                 OK
                                          </button>
                                   </div>
                                   {/* choose from */}
                                   <div className="w-full py-4 flex justify-center items-center px-6 gap-x-4 relative" style={{ display: "none" }} ref={from}>
                                          <div className="w-full h-16 border border-neutral-300 px-6 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative">
                                                 <h6 className="inline text-neutral-800 bg-white absolute left-2 -bottom-2 text-xs">HOURS</h6>
                                                 <div className="w-full h-48 overflow-hidden -mt-19 py-22" onMouseOver={() => document.body.style.overflow = "hidden"} onMouseLeave={() => document.body.style.overflow = ""}>
                                                        <ul ref={fromHoursList} onWheel={(event) => scrollHandler(event, fromHoursList.current)} className={` ${styles.scrollList} scrollList flex flex-col gap-y-8`}></ul>
                                                 </div>
                                          </div>
                                          <div>
                                                 <p className="text-4xl">:</p>
                                          </div>
                                          <div className="w-full h-16 border border-neutral-300 px-6 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative">
                                                 <h6 className="inline text-neutral-800 bg-white absolute left-2 -bottom-2 text-xs">MINUTES</h6>
                                                 <div className="w-full h-48 overflow-hidden -mt-19 py-22" onMouseOver={() => document.body.style.overflow = "hidden"} onMouseLeave={() => document.body.style.overflow = ""}>
                                                        <ul ref={fromMinuteList} onWheel={(event) => scrollHandler(event, fromMinuteList.current)} className={` ${styles.scrollList} scrollList flex flex-col gap-y-8`}></ul>
                                                 </div>
                                          </div>
                                          <button className="w-9/10 px-2 py-1 mx-12 text-xs border absolute -bottom-22 rounded-md text-center bg-green-100 cursor-pointer" onClick={approvedFromTime}>
                                                 ADD START TIME
                                          </button>
                                   </div>
                                   {/* choose to */}
                                   <div className="w-full py-4 flex justify-center items-center px-6 gap-x-4 " style={{ display: "none" }} ref={to}>
                                          <div className="w-full h-16 border border-neutral-300 px-6 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative">
                                                 <h6 className="inline text-neutral-800 bg-white absolute left-2 -bottom-2 text-xs">HOURS</h6>
                                                 <div className="w-full h-48 overflow-hidden -mt-19 py-22" onMouseOver={() => document.body.style.overflow = "hidden"} onMouseLeave={() => document.body.style.overflow = ""}>
                                                        <ul ref={toHoursList} onWheel={(event) => scrollHandler(event, toHoursList.current)} className={` ${styles.scrollList} scrollList flex flex-col gap-y-8`}></ul>
                                                 </div>
                                          </div>
                                          <div>
                                                 <p className="text-4xl">:</p>
                                          </div>
                                          <div className="w-full h-16 border border-neutral-300 px-6 rounded-xl cursor-pointer text-center text-2xl text-neutral-800 relative">
                                                 <h6 className="inline text-neutral-800 bg-white absolute left-2 -bottom-2 text-xs">MINUTES</h6>
                                                 <div className="w-full h-48 overflow-hidden -mt-19 py-22" onMouseOver={() => document.body.style.overflow = "hidden"} onMouseLeave={() => document.body.style.overflow = ""}>
                                                        <ul ref={toMinuteList} onWheel={(event) => scrollHandler(event, toMinuteList.current)} className={` ${styles.scrollList} scrollList flex flex-col gap-y-8`}></ul>
                                                 </div>
                                          </div>
                                          <button className="w-9/10 px-2 py-1 mx-12 text-xs border absolute -bottom-22 rounded-md text-center bg-green-100 cursor-pointer" onClick={approvedToTime}>
                                                 ADD END TIME
                                          </button>
                                   </div>
                            </div>

                     </section>
              </>
       )
})

export default TimePicker;
