import { useEffect, useMemo, useRef, useState } from "react";
import StepOverlay from "../components/wallet/StepOverlay.jsx";
import {
  createVault,
  simulateTransaction,
  formatAmount,      // Token aware formatter
  parseEthToWei,
} from "../lib/walletLogic.js";

// add DEPOSIT step (after DETAILS)
const STEPS = { DETAILS: 1, DEPOSIT: 2, NEW_TX: 3, EXECUTED: 4, COMPARE: 5 };

export default function WalletPage() {
  const [step, setStep] = useState(STEPS.DETAILS);
  const [vault, setVault] = useState(() => createVault());

  // asset selection & labels
  const [asset, setAsset] = useState("USDC"); // USDC | USDT
  const qAsset = `q${asset}`;

  // Tx flow state
  const [toAddress, setToAddress] = useState("");
  const [amountEth, setAmountEth] = useState("");
  const [executed, setExecuted] = useState(null); // {tx, ecc, qs}

  // deposit amount
  const [depositAmt, setDepositAmt] = useState("1000"); // default demo amount

  // overlay state
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlay, setOverlay] = useState({
    title: "",
    body: "",
    icon: "src/assets/S1_img.png",
  });

  //sign with wallet status:
  const [walletSignStatus, setWalletSignStatus] = useState("idle"); 
  // idle | loading | done


  // NEW: remember which step's overlay has been shown
  const shownOverlayRef = useRef({});

  //--------------------------------------------- show overlay card whenever the step changes-----------------------------------------------------
  useEffect(() => {
    // show each step's overlay only once
    if (shownOverlayRef.current[step]) return;

    if (step === STEPS.DETAILS) {
      setOverlay({
        title: "Step 01: Your wallet has been created!",
        body:
          "Your wallet includes an address, public key, and private key. Always keep your private key secure and save it offline. This key is your access to the wallet.",
        icon: "src/assets/s2icon.png",
      });
    } else if (step === STEPS.DEPOSIT) {
      setOverlay({
        title: "Step 02: Deposit a stablecoin.",
        body:
          "Choose USDT or USDC to deposit. Your balance will be shown as a quantum-secured stablecoin.",
        icon: "src/assets/s3icon.png",
      });
    } else if (step === STEPS.NEW_TX) {
      setOverlay({
        title: "Step 03: Send your first transaction.",
        body:
          `Simulate sending a quantum-secure transaction by choosing the receiving wallet and the amount of ${qAsset} to send.`,
        icon: "src/assets/s3icon.png",
      });
    } else if (step === STEPS.EXECUTED) {
      setOverlay({
        title: "Step 04: Transaction executed.",
        body:
          "Your transaction has been successfully executed. You can view the transaction hash and quantum-proof signature.",
        icon: "src/assets/s4icon.png",
      });
    } else if (step === STEPS.COMPARE) {
      setOverlay({
        title: "Step 05: Compare to ECC.",
        body:
          "Go ahead and compare Suva’s quantum-proof signature to Ethereum’s standard ECC scheme.",
        icon: "src/assets/s5icon.png",
      });
    }

    setOverlayOpen(true);
    shownOverlayRef.current[step] = true;
  }, [step]); // IMPORTANT: remove qAsset here so switching coins doesn't reopen

  // derived display values
  const balanceFormatted = useMemo(
    () => formatAmount(vault.balanceWei, qAsset),
    [vault.balanceWei, qAsset]
  );

  // navigation
  const goDeposit = () => setStep(STEPS.DEPOSIT);
  const goNewTx = () => setStep(STEPS.NEW_TX);
  const goExecuted = () => setStep(STEPS.EXECUTED);
  const goCompare = () => setStep(STEPS.COMPARE);
  const backOne = () => setStep((s) => Math.max(STEPS.DETAILS, s - 1));
  const restartDemo = () => {
    setVault(createVault());
    setToAddress("");
    setAmountEth("");
    setExecuted(null);
    setDepositAmt("1000");
    setAsset("USDC");
    shownOverlayRef.current = {}; // reset overlay memory on restart
    setStep(STEPS.DETAILS);
  };

  // ------------------ Dice, generate random add ------------------------------
  const handleDice = () => setToAddress(WalletAddressLike());

  // dummy regular sign
  const handleRegularSign = () => {
    if (walletSignStatus === "loading") return; // prevent spam

    setWalletSignStatus("loading");

    setTimeout(() => {
      setWalletSignStatus("done");
    }, 900); // resolves in a tick (0.9s)
  };


  // Quantum sign + send existing logic
  const handleSendTx = async () => {
    const to = toAddress;
    const amountWei = parseEthToWei(amountEth || "0.01");

    const result = await simulateTransaction({
      wallet: vault.wallet,
      from: vault.address,
      to,
      amountWei,
      gasLimit: 21000,
      maxFeePerGasGwei: 20,
      maxPriorityFeePerGasGwei: 5,
      nonce: 0,
      chainId: 1,
    });

    // deduct balance
    setVault((v) => ({ ...v, balanceWei: v.balanceWei.sub(amountWei) }));
    setExecuted(result);
    goExecuted();
  };

  // Handle deposit (choose asset, deposit, go to send page)
  const handleDeposit = () => {
    const amt = parseEthToWei(depositAmt || "0");
    setVault((v) => ({ ...v, balanceWei: v.balanceWei.add(amt) }));
    goNewTx();
  };

  return (
    <div className="min-h-screen bg-[#0d0e0e] text-[#e7e7ea]">
      {/* -------------------------------------------------------------Header-------------------------------------------------------------------*/}
      <header className="relative z-10 w-full py-[7px] text-center bg-transparent">
        <img
          src="src/assets/WHITE.png"
          alt="SUVA"
          className="mx-auto h-[27px] md:h-[32px] lg:h-[37px] object-contain"
        />
        <div className="mt-[4.5px] mx-auto h-px w-[75%] bg-gradient-to-r from-transparent via-[#eaeaea] to-transparent opacity-60" />
      </header>

      {/* ------------------------------------------------------------Content -------------------------------------------------------------------*/}
      <main className="mx-auto max-w-[1100px] px-6 pb-24 pt-8">
        {/* top title */}
        <div className="mb-8 flex items-center gap-4">
          <div className="[font-family:'NeueHaasDisplayMediu',sans-serif] text-[20px] text-[#eaeaea] tracking-[0.08em] drop-shadow-[0_0_6px_rgba(235,235,235,1)]">
            {step === STEPS.DETAILS ? "01"
              : step === STEPS.DEPOSIT ? "02"
              : step === STEPS.NEW_TX ? "03"
              : step === STEPS.EXECUTED ? "04"
              : "05"}
          </div>
          <div className="text-[15px] text-[#eaeaea]">|</div>
          <h1 className="[font-family:'NeueHaasDisplayMediu',sans-serif] text-[20px] text-[#eaeaea]">
            {step === STEPS.DETAILS && "Wallet Details"}
            {step === STEPS.DEPOSIT && "Deposit Stablecoin"}
            {step === STEPS.NEW_TX && "New Transaction"}
            {step === STEPS.EXECUTED && "Transaction Executed"}
            {step === STEPS.COMPARE && "Compare Transaction"}
          </h1>
        </div>

        {/* ----------------------------------------------------------------STEPS-------------------------------------------------------------------*/}
        {/* STEP 1: Wallet Details */}
        {step === STEPS.DETAILS && (
          <section className="space-y-6">
            <Field label="Suva Vault Address" value={vault.address} copyable />
            <Field label="ECC Public Key" value={vault.eccPublicKey} copyable />
            <Field label="ECC Private Key" value={vault.eccPrivateKey} copyable />
            <Field label="QS Public Key" value={vault.qsPublicKey} copyable />
            <Field label="QS Private Key" value={vault.qsPrivateKey} copyable />
            <Field label="Balance" value={balanceFormatted} mono={false} />

            <div className="mt-3">
              <PillButton
                onClick={goDeposit}
                label="Deposit Stablecoin"
                bg="#0E1623"
                text="#7FB2FF"
                width="220px"
                height="45px"
                radius="24px"
              />
            </div>
          </section>
        )}

        {/* STEP 2: Deposit Stablecoin */}
        {step === STEPS.DEPOSIT && (
          <section className="space-y-7">
            <div className="text-[16px] text-[#a8a9ac]">Choose Stablecoin</div>
            <div className="mt-2 flex gap-3">
              <PillButton
                onClick={() => setAsset("USDC")}
                bg="#0E1623"
                text="#7FB2FF"
                width="140px"
                height="45px"
                radius="18px"
                label={
                  <div className="flex items-center gap-2">
                    <img
                      src="src/assets/USDC_logo.png"
                      alt="USDC"
                      className="w-[25px] h-[25px]"
                    />
                    <span>USDC {asset === "USDC" ? "✓" : ""}</span>
                  </div>
                }
              />

              <PillButton
                onClick={() => setAsset("USDT")}
                bg="#0E1623"
                text="#7FB2FF"
                width="140px"
                height="45px"
                radius="18px"
                label={
                  <div className="flex items-center gap-2">
                    <img
                      src="src/assets/USDT_logo.png"
                      alt="USDT"
                      className="w-[25px] h-[25px]"
                    />
                    <span>USDT {asset === "USDT" ? "✓" : ""}</span>
                  </div>
                }
              />
            </div>

            <div className="mb-2">
              <div className="text-[16px] text-[#a8a9ac]">Amount to deposit</div>
              <input
                value={depositAmt}
                onChange={(e) => setDepositAmt(e.target.value)}
                className="mt-2 w-[220px] rounded-xl bg-[#121212] text-[#e7e7ea] px-4 py-3 outline outline-1 outline-white/10 placeholder:text-[12px]"
                placeholder="1000"
              />
            </div>

            <div className="mt-2 flex gap-3">
              <PillButton
                onClick={backOne}
                label="Back"
                bg="#3A0F12"
                text="#FF5E5E"
                width="90px"
                height="45px"
                radius="24px"
              />
              <PillButton
                onClick={handleDeposit}
                label="Deposit"
                bg="#0E1623"
                text="#7FB2FF"
                width="160px"
                height="45px"
                radius="24px"
              />
            </div>
          </section>
        )}

        {/* STEP 3: New Transaction */}
        {step === STEPS.NEW_TX && (
          <section className="space-y-7">
            <Field label="From" value={vault.address} copyable />

            {/* To + Dice */}
            <div className="mb-6">
              <div className="text-[16px] text-[#a8a9ac]">To</div>
              <div className="mt-2 relative max-w-[680px]">
                <input
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] text-[#e7e7ea] px-4 py-3 outline outline-1 outline-white/10 placeholder:text-[12px] pr-12"
                  placeholder="Type Address Or Randomize With Dice Button."
                />
                <button
                  type="button"
                  onClick={handleDice}
                  aria-label="Generate random address"
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 hover:opacity-100 transition"
                >
                  <img src="src/assets/Dice.png" alt="Dice" className="w-[19px] h-[19px] pointer-events-none animate-[diceGlow_3s_ease-in-out_infinite]" />
                </button>
              </div>
            </div>

            <Field label="Balance" value={balanceFormatted} mono={false} />

            <div className="mb-6">
              <div className="text-[16px] text-[#a8a9ac]">Amount ({qAsset})</div>
              <input
                value={amountEth}
                onChange={(e) => setAmountEth(e.target.value)}
                className="mt-2 w-[180px] rounded-xl bg-[#121212] text-[#e7e7ea] px-4 py-3 outline outline-1 outline-white/10 placeholder:text-[12px]"
                placeholder="0.01"
              />
            </div>

            {/* Buttons: Back + Regular Sign (dummy) + Quantum Sign */}
            <div className="mt-2 flex gap-3 flex-wrap">
              <PillButton
                onClick={backOne}
                label="Back"
                bg="#3A0F12"
                text="#FF5E5E"
                width="90px"
                height="45px"
                radius="24px"
              />
              <PillButton
                onClick={handleRegularSign}
                bg="#1A1A1A"
                text="#D1D1D1"
                width="180px"
                height="45px"
                radius="24px"
              >
                <span className="flex items-center gap-2">
                  Sign with wallet

                  {walletSignStatus === "loading" && (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  )}

                  {walletSignStatus === "done" && (
                    <span className="text-green-400 text-lg">✓</span>
                  )}
                </span>
              </PillButton>
              <PillButton
                onClick={handleSendTx}
                label="Sign with quantum signature"
                bg="#0E1623"
                text="#7FB2FF"
                width="280px"
                height="45px"
                radius="24px"
              />
            </div>
          </section>
        )}

        {/* STEP 4: Transaction Executed */}
        {step === STEPS.EXECUTED && executed && (
          <section className="space-y-6">
            <Field label="Transaction Hash" value={executed.tx.hash} copyable />
            <Field label="From" value={executed.tx.from} copyable />
            <Field label="To" value={executed.tx.to} copyable />
            <Field label="Value" value={formatAmount(executed.tx.valueWei, qAsset)} mono={false} />
            <Field label="Gas Limit" value={String(executed.tx.gasLimit)} mono={false} />
            <Field label="Max Gas Fee" value={`${executed.tx.maxFeePerGasGwei} Gwei`} mono={false} />
            <Field label="Max Gas Priority Fee" value={`${executed.tx.maxPriorityFeePerGasGwei} Gwei`} mono={false} />
            <Field label="Nonce" value={String(executed.tx.nonce)} mono={false} />
            <Field label="Chain id" value={String(executed.tx.chainId)} mono={false} />

            <div className="mt-2 flex gap-3">
              <PillButton onClick={backOne} label="Back" bg="#3A0F12" text="#FF5E5E" width="90px" height="45px" radius="24px" />
              <PillButton onClick={goCompare} label="Compare Transaction" bg="#0E1623" text="#7FB2FF" width="240px" height="45px" radius="24px" />
            </div>
          </section>
        )}

        {/* STEP 5: Compare Transaction (unchanged except it now represents stablecoin context) */}
        {step === STEPS.COMPARE && executed && (
          <section className="space-y-8">
            {/* ECC */}
            <div>
              <h3 className="mb-3 text-[16px] font-medium text-white/90">
                ECC Secured Transaction
              </h3>
              <Field label="Signature" inline />
              <Field label="V:" value={executed.ecc.v} inline />
              <Field label="R:" value={executed.ecc.r} inline copyable />
              <Field label="S:" value={executed.ecc.s} inline copyable />
              <br />
              <Field label="Classical Computing Safety" value="128 bits" mono={false} textColor="#7FB2FF" />
              <Field label="Quantum Computing Safety" value="0 bits" mono={false} textColor="#FF5E5E" />
              <Field label="Security Level" value="Level 1: Non Quantum Security" mono={false} textColor="#FF5E5E" />
            </div>

            {/* SUVA */}
            <div>
              <h3 className="mb-3 text-[16px] font-medium text-white/90">
                Suva Secured Transaction
              </h3>
              <Field label="Signature" value={executed.qs.signature} copyable />
              <Field label="Classical Computing Safety" value="256 bits" mono={false} textColor="#7FB2FF" />
              <Field label="Quantum Computing Safety" value="128 bits" mono={false} textColor="#7FB2FF" />
              <Field label="Security Level" value="Level 4: Full Quantum Security" mono={false} textColor="#7FB2FF" />
            </div>

            <div className="mt-2 flex gap-3">
              <PillButton onClick={backOne} label="Back" bg="#3A0F12" text="#FF5E5E" width="90px" height="45px" radius="24px" />
              <PillButton onClick={restartDemo} label="Restart Demo" bg="#0E1623" text="#7FB2FF" width="200px" height="45px" radius="24px" />
            </div>
          </section>
        )}
      </main>

      {/* overlay */}
      <StepOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        title={overlay.title}
        iconSrc={overlay.icon}
      >
        {overlay.body}
      </StepOverlay>
    </div>
  );
}

/* ----------------------------------------------------------------buttons---------------------------------------------------------------------- */
function PillButton({ onClick, label, children, bg = "#0E1623", text = "#7FB2FF", radius = "24px", width, height }) {
  return (
    <button type="button" onClick={onClick} className="relative cursor-pointer select-none suva-button button-glimmer group" style={{ "--ring-radius": radius, "--ring-width": "2px", width, height }}>
      <div className="absolute left-[1px] top-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] rounded-[24px] transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(255,255,255,0.35)] group-hover:brightness-125" style={{ backgroundColor: bg, borderRadius: radius }} />
      <span className="relative z-20 [font-family:'NeueHaasDisplayMediu',sans-serif] leading-none flex items-center justify-center w-full h-full" style={{ color: text, fontSize: "16px" }}>{children || label}</span>
    </button>
  );
}

function Field({ label, value, mono = true, copyable = false, inline = false, textColor = "#e7e7ea", }) {
  const [copied, setCopied] = useState(false);
  const text = typeof value === "string" ? value : String(value ?? "");
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  if (inline) {
    return (
      <div className="mb-0">
        <div className="mt-1 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[17px]">
          <span className="text-[#a8a9ac] mr-2">{label}</span>
          <span className={mono ? "font-mono tracking-tight" : ""} title={text} style={{ color: textColor }}>
            {value}
          </span>
          {copyable && (
            <>
              <button type="button" onClick={handleCopy} aria-label={`Copy ${label}`} className="opacity-60 hover:opacity-100 transition">
                <img src="src/assets/CopyIcon.png" alt="" className="w-[18px] h-[18px] pointer-events-none" />
              </button>
              {copied && <span className="text-[11px] text-[#9ae6b4]">Copied!</span>}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="text-[16px] text-[#a8a9ac]">{label}</div>
      <div className="mt-2 relative">
        <div className={`max-w-full truncate pr-8 text-[17px] ${mono ? "font-mono tracking-tight" : ""}`} title={text} style={{ color: textColor }}>
          {value}
        </div>
        {copyable && (
          <>
            <button type="button" onClick={handleCopy} aria-label={`Copy ${label}`} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition">
              <img src="src/assets/CopyIcon.png" alt="" className="w-[18px] h-[18px] pointer-events-none" />
            </button>
            {copied && <span className="absolute -top-5 right-0 text-[11px] text-[#9ae6b4]">Copied!</span>}
          </>
        )}
      </div>
    </div>
  );
}

function WalletAddressLike() {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return "0x" + hex;
}
