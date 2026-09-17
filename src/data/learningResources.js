// Original teaching diagrams are bundled locally; references remain on publisher sites.
const ref = (title, url, kind = "原廠教學") => ({ title, url, kind });
const sources = {
  passive: ref("Vishay｜被動元件圖錄與封裝", "https://www.vishay.com/docs/49638/ms6163.pdf", "原廠圖錄 PDF"),
  labs: ref("TI Precision Labs｜類比與數位電路課程", "https://www.ti.com/video/series/precision-labs.html"),
  power: ref("TI｜電源元件、資料表與設計資源", "https://www.ti.com/product-category/power-management/overview.html", "產品／資料表入口"),
  interface: ref("TI｜通訊介面與實體層資源", "https://www.ti.com/product-category/interface/overview.html", "產品／資料表入口"),
  serial: ref("TI｜UART、SPI 與 MCU 通訊課程", "https://www.ti.com/video/series/precision-labs/ti-precision-labs-microcontroller-communication.html"),
  i2c: ref("NXP｜UM10204 I²C 匯流排規範", "https://community.nxp.com/pwmxy87654/attachments/pwmxy87654/nxp-designs/931/1/UM10204.pdf", "規範 PDF"),
  scope: ref("Tektronix｜示波器設定與量測", "https://www.tek.com/en/documents/primer/setting-and-using-oscilloscope"),
  probes: ref("Tektronix｜ABCs of Probes", "https://www.tek.com/en/documents/whitepaper/abcs-probes-primer", "探棒指南"),
  powerTest: ref("Tektronix｜電源量測與分析", "https://www.tek.com/en/documents/application-note/power-supply-measurement-analysis-bench-oscilloscopes", "Application Note"),
  supply: ref("Keysight｜電源供應器與電子負載基礎", "https://www.keysight.com/vn/en/learn/course.power-supply-and-electronic-load-basics.html"),
  dmm: ref("Fluke｜直流電壓量測接線圖", "https://www.fluke.com/en-us/learn/blog/digital-multimeters/how-to-measure-dc-voltage-with-a-digital-multimeter"),
  thermal: ref("Fluke｜電氣熱像檢查", "https://www.fluke.com/en-us/learn/blog/thermal-imaging/electrical-systems"),
  insulation: ref("Fluke｜絕緣電阻測試器選用", "https://www.fluke.com/en-us/learn/blog/electrical/how-to-choose-an-insulation-resistance-tester"),
  emc: ref("Rohde & Schwarz｜EMI 預相容測試", "https://scdn.rohde-schwarz.com/ur/pws/dl_downloads/dl_common_library/dl_brochures_and_datasheets/pdf_1/Educational_Note_-_Understanding_EMI_Precompliance_Testing.pdf", "教學 PDF"),
  tesla: ref("Tesla Model Y｜車主手冊", "https://www.tesla.com/ownersmanual/modely/en_gb/Owners_Manual.pdf", "車主手冊 PDF"),
  divider: ref("TI｜分壓取樣與 ADC 設計", "https://www.ti.com/document-viewer/lit/html/SNAA363", "Application Brief"),
};

const referencesByItem = {};
function assign(ids, keys) {
  ids.split(" ").forEach((id) => { referencesByItem[id] = keys.map((key) => sources[key]); });
}
assign("resistor capacitor inductor ferrite-bead transformer", ["passive"]);
assign("diode zener bjt mosfet tvs fuse power-switch pmic ldo dcdc gate-driver", ["power"]);
assign("op-amp comparator", ["labs"]);
referencesByItem["op-amp"].push(ref("TI LM358｜範例料號資料表", "https://www.ti.com/lit/ds/symlink/lm358.pdf", "Datasheet PDF"));
referencesByItem.mcu = [ref("ST｜STM32 MCU 入門", "https://wiki.st.com/stm32mcu/wiki/STM32StepByStep%3ASTM32MCU_basics")];
assign("divider", ["divider"]);
assign("rc-filter pull-up-down reset current-sense level-shift isolation", ["labs"]);
assign("mosfet-switch power-rail protection gate-drive", ["power", "powerTest"]);
assign("uart spi", ["serial"]);
assign("i2c", ["i2c"]);
assign("can lin ethernet usb pcie", ["interface"]);
assign("no-power short voltage-margin mosfet-gate", ["powerTest"]);
assign("comm-fail", ["serial", "interface"]);
assign("hipot-fail hipot-insulation-tester", ["insulation"]);
assign("sensor-signal intermittent", ["scope", "probes"]);
assign("lv-system hv-system battery-system charging-system drive-unit thermal-system adas-autopilot", ["tesla"]);
assign("dmm", ["dmm"]);
assign("oscilloscope differential-current-probe", ["scope", "probes"]);
assign("power-supply electronic-load", ["supply"]);
assign("logic-analyzer", ["serial"]);
assign("can-lin-analyzer usb-protocol-analyzer", ["interface"]);
assign("thermal-camera", ["thermal"]);
assign("esd-gun emc-near-field-probe", ["emc"]);
referencesByItem["esd-gun"] = [ref("AMETEK CTS｜ESD 模擬器與測試配件", "https://www.ametek-cts.com/products/productgroups/electrostatic-discharge-esd", "原廠產品與測試介紹")];
referencesByItem.fuse = [ref("Littelfuse｜Fuseology 保險絲選用指南", "https://info.littelfuse.com/fuseology-design-guide-ug", "設計指南入口")];
for (const id of ["diode", "zener", "tvs"]) {
  referencesByItem[id] = [ref("Vishay｜二極體、保護元件與資料表", "https://www.vishay.com/en/diodes/", "產品／資料表入口")];
}
referencesByItem.mosfet = [ref("Vishay｜MOSFET 封裝與資料表", "https://www.vishay.com/en/mosfets/tab/products/", "產品／資料表入口")];
referencesByItem.bjt = [ref("Diodes｜BJT 與離散半導體", "https://www.diodes.com/products/discrete-semiconductors", "產品／資料表入口")];
referencesByItem.can = [ref("TI｜CAN 實體層設計要求", "https://www.ti.com/lit/pdf/slla270", "Application Report PDF")];
referencesByItem.lin = [ref("TI｜LIN 概觀與訓練", "https://www.ti.com/video/5741358648001")];

const diagrams = {
  can: { file: "can", title: "高速 CAN 匯流排終端", caption: "典型線型高速 CAN：只在匯流排兩端各接 120 Ω，理想斷電量測約 60 Ω。須確認節點與終端配置；本圖省略參考地與收發器保護。" },
  divider: { file: "divider", title: "電阻分壓與量測節點", caption: "無負載理想情況：Vout = Vin × R2 / (R1 + R2)。接上負載後須重新計算等效阻抗。" },
  rc: { file: "rc", title: "一階 RC 低通濾波", caption: "R 串聯、C 對地；輸出取電容兩端。理想截止頻率 fc = 1 / (2πRC)。" },
  i2c: { file: "i2c", title: "I²C 開漏匯流排與上拉", caption: "SDA、SCL 分別上拉到相容的 VDD。上拉值須配合匯流排電容與速度，不能直接照抄。" },
  uart: { file: "uart", title: "UART 8N1 示意波形", caption: "範例 0x55，LSB 先送，無同位元；高電位閒置、1 個起始位、8 個資料位、1 個停止位。這是邏輯層波形，非 RS-232 電壓。" },
  dmm: { file: "dmm", title: "DMM 直流電壓並聯量測", caption: "低壓 DC 範例：黑棒接 COM，紅棒接 VΩ，選 DC V 並跨接待測兩端。不可用電流檔並聯電源。" },
  scope: { file: "scope", title: "單端探棒量測參考點", caption: "僅示意可安全接地的低壓 DUT。一般桌上型示波器地夾連到保護接地；不可夾到浮接開關節點或高壓端。" },
  power: { file: "power", title: "電源軌逐段定位", caption: "依序比對 VIN、EN、VOUT 與負載端電壓；方塊圖省略去耦、回授與保護元件。" },
  passive: { file: "passive", title: "R／C／L 基本電路符號", caption: "符號用於辨認電路功能，不代表實際封裝或 PCB 焊墊。元件外觀可參考下方 Vishay 原廠圖錄。" },
};
const diagramByItem = {};
function illustrate(ids, key) {
  ids.split(" ").forEach((id) => { diagramByItem[id] = diagrams[key]; });
}
illustrate("resistor capacitor inductor", "passive");
illustrate("divider", "divider");
illustrate("rc-filter", "rc");
illustrate("i2c pull-up-down", "i2c");
illustrate("uart logic-analyzer", "uart");
illustrate("can can-lin-analyzer comm-fail", "can");
illustrate("dmm", "dmm");
illustrate("oscilloscope differential-current-probe sensor-signal", "scope");
illustrate("power-rail no-power voltage-margin ldo dcdc pmic", "power");

export function getLearningResources(itemId) {
  return { diagram: diagramByItem[itemId], references: referencesByItem[itemId] ?? [] };
}
