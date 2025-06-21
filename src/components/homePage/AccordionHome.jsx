import { useState } from "react";
import BaseSection from "@/components/common/BaseSection";
import BaseImage from "@/components/common/BaseImage";
import men from "@/assets/icons/men.webp";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AddSquare, MinusSquare } from "iconsax-react";

const AccordionHome = () => {
  const matches = useMediaQuery("(min-width:1024px)");
  const [openItem, setOpenItem] = useState(null);

  const faqData = [
    {
      title: "در صورت بروز نقص فنی برای خودرو چه اتفاقی می‌افتد؟",
      content: "در صورت بروز هرگونه نقص فنی، تیم پشتیبانی اتورنت به صورت ۲۴ ساعته در دسترس است. بسته به نوع مشکل، خودروی جایگزین ارسال شده یا خودرو توسط تیم امداد فنی تعمیر خواهد شد. تمام خودروها پیش از تحویل سرویس کامل می‌شوند، اما در صورت خرابی، هیچ هزینه‌ای از اجاره‌گیرنده دریافت نخواهد شد.",
    },
    {
      title: "هزینه بنزین و کارواش در خودروهای اجاره‌ای به عهده کیست؟",
      content: "هزینه سوخت و کارواش در مدت زمان اجاره بر عهده اجاره‌گیرنده است. خودرو هنگام تحویل دارای باک پر و تمیز است، و باید در شرایط مشابه (سوخت کافی و تمیز) بازگردانده شود. در غیر این صورت هزینه نظافت یا سوخت از ودیعه کسر خواهد شد.",
    },
    {
      title: "آیا ماشین‌های اتورنت دارای بیمه هستند؟",
      content: "بله، کلیه خودروهای اتورنت دارای بیمه شخص ثالث و بدنه هستند. همچنین امکان انتخاب بیمه‌نامه‌های تکمیلی برای کاهش مسئولیت مالی در حوادث وجود دارد. قبل از اجاره می‌توانید نوع بیمه را با توجه به نیاز خود انتخاب نمایید.",
    },
    {
      title: "محدودیت کیلومتر در اجاره خودرو چقدر می‌باشد؟",
      content: "محدودیت کیلومتر برای هر خودرو متفاوت است و در زمان رزرو مشخص می‌شود. به طور معمول بین ۲۰۰ تا ۳۰۰ کیلومتر در روز در نظر گرفته می‌شود. در صورت عبور از حد مجاز، هزینه اضافه بر کیلومتر بر اساس تعرفه از شما دریافت خواهد شد.",
    },
  ];

  const handleChange = (value) => {
    setOpenItem((prev) => (prev === value ? null : value));
  };
  return (
    <>
      <BaseSection title="سؤالات متداول" highlight={import.meta.env.VITE_APP_NAME} description="پر تکرارترین سؤالاتی که پرسیدید">
        <div className="flex flex-col items-center justify-between w-full mt-10 lg:flex-row lg:items-start gap-x-6">
          <div className="w-full h-full lg:w-fit lg:flex-1/2">
            <Accordion type="single" collapsible value={openItem} onValueChange={handleChange} className="w-full mt-2 space-y-3 text-sm leading-loose text-neutral-gray-7">
              {faqData.map((item, index) => {
                const value = `item-${index}`;
                const isOpen = openItem === value;

                return (
                  <AccordionItem value={value} key={index} className="!border-2 !outline-0 rounded-2xl bg-white border-neutral-gray-2 w-full px-4 py-2">
                    <AccordionTrigger className="w-full [&>svg]:hidden no-underline hover:no-underline focus-visible:!ring-0 focus-visible:!ring-ring/0">
                      <div className="flex items-center w-full gap-x-3">
                        {isOpen ? <MinusSquare className="size-6 fill-primary" variant="Outline" aria-hidden="true" /> : <AddSquare className="size-6 fill-primary" variant="Outline" aria-hidden="true" />}
                        <span className="flex-1 text-sm font-semibold text-start xs:text-base text-neutral-gray-10"> {item.title}</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="text-neutral-gray-7 !leading-relaxed text-sm mt-2">{item.content}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {matches && <BaseImage src={men} alt="men" className="w-auto h-auto" />}
        </div>
      </BaseSection>
    </>
  );
};

export default AccordionHome;
