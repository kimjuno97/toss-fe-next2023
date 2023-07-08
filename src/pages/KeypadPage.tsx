import { Button } from '_tosslib/components/Button';
import { Input } from '_tosslib/components/Input';
import { Spacing } from '_tosslib/components/Spacing';
import { Txt } from '_tosslib/components/Txt';
import colors from '_tosslib/constants/colors';
import { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { CreateKeypad, createKeypad } from './remotes';

export function KeypadPage() {
  const [keypad, setCreateKey] = useState<CreateKeypad | undefined>();
  const [keypadToggle, setKeypadToggle] = useState({
    password: false,
    passwordCheck: false,
  });

  const [passwordInput, setPasswordInput] = useState({ password: '', passwordCheck: '' });
  // const [encryptPassword, setEncryptPassword] = useState<number[][]>([]);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInput(prev => ({ ...prev, [name]: value }));
  };

  const keypadOnOffHandler = (targetInput: 'password' | 'passwordCheck', status: boolean) => () => {
    setKeypadToggle(prev => ({ ...prev, [targetInput]: status }));
  };

  const encryptPasswordHandler = (targetIndex: number[]) => () => {
    console.log(targetIndex);
  };

  useEffect(() => {
    createKeypad().then(res => {
      setCreateKey(res);
    });
  }, []);

  return (
    <section>
      <Txt typography="h1" color={colors.black}>
        토스 보안키패드 기술과제
      </Txt>
      <Input label="비밀번호">
        <Input.TextField
          name="password"
          onClick={keypadOnOffHandler('password', true)}
          onChange={inputHandler}
          value={passwordInput.password}
        />
      </Input>
      {keypad && keypadToggle.password && (
        <EncryptionKeypad
          targetInput="password"
          keypad={keypad}
          keypadOnOffHandler={keypadOnOffHandler}
          encryptPasswordHandler={encryptPasswordHandler}
        ></EncryptionKeypad>
      )}
      <Spacing size={24} />
      <Input label="비밀번호 확인">
        <Input.TextField
          name="passwordCheck"
          onClick={keypadOnOffHandler('passwordCheck', true)}
          onChange={inputHandler}
          value={passwordInput.passwordCheck}
        />
      </Input>
      {keypad && keypadToggle.passwordCheck && (
        <EncryptionKeypad
          targetInput="passwordCheck"
          keypad={keypad}
          keypadOnOffHandler={keypadOnOffHandler}
          encryptPasswordHandler={encryptPasswordHandler}
        ></EncryptionKeypad>
      )}
      <Spacing size={24} />
      <Button css={{ width: '100%' }}>완료</Button>
    </section>
  );
}

interface EncryptionKeypadProps {
  keypad: CreateKeypad;
  keypadOnOffHandler: (key: 'password' | 'passwordCheck', status: boolean) => () => void;
  targetInput: 'password' | 'passwordCheck';
  encryptPasswordHandler: (targetIndex: number[]) => () => void;
}
/** keypad */
function EncryptionKeypad({ targetInput, keypad, keypadOnOffHandler, encryptPasswordHandler }: EncryptionKeypadProps) {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          zIndex: 1,
          marginTop: '10px',
          borderRadius: '10px',
          padding: '24px',
          border: `1px solid ${colors.grey400}`,
          background: colors.white,
          width: '482px', // 왜 width가 늘어날까..
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: '8px',
            gridTemplateColumns: `repeat(${keypad?.keypad.size.columns + 1},80px)`,
            gridTemplateRows: `repeat(${keypad?.keypad.size.rows},80px)`,
          }}
        >
          {keypad?.keypad.svgGrid.map((el, rowIndex) => {
            return el.map((svg, columnIndex) => {
              const uniqueKey = rowIndex + '-' + columnIndex;
              const targetIndex = [rowIndex, columnIndex];

              if (columnIndex === el.length - 1) {
                return (
                  <>
                    <div
                      key={uniqueKey}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.grey50,
                        borderRadius: '5px',
                        color: colors.black,
                      }}
                      onClick={encryptPasswordHandler(targetIndex)}
                      dangerouslySetInnerHTML={{ __html: svg }}
                    ></div>
                    <RightKeyPadButton onClick={keypadOnOffHandler(targetInput, false)} rowIndex={rowIndex} />
                  </>
                );
              }
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.grey50,
                    borderRadius: '5px',
                  }}
                  key={uniqueKey}
                  onClick={encryptPasswordHandler(targetIndex)}
                  dangerouslySetInnerHTML={{ __html: svg }}
                ></div>
              );
            });
          })}
        </div>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <p style={{ margin: '0px' }}>비밀번호를 입력해주세요</p>
          <p style={{ margin: '0px' }}>6자리로 입력해주세요</p>
        </div>
      </div>
    </>
  );
}

interface RightKeyPadButtonPros extends ButtonHTMLAttributes<HTMLButtonElement> {
  rowIndex: number;
}
/** ←, 전체삭제, 확인 버튼 */
function RightKeyPadButton({ rowIndex, ...props }: RightKeyPadButtonPros) {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.blue50,
    color: colors.blue700,
    fontSize: '13px',
  };
  switch (rowIndex) {
    case 0:
      return <Button style={buttonStyle}>←</Button>;
    case 1:
      return <Button style={buttonStyle}>전체삭제</Button>;
    case 2:
      return (
        <Button variant="primary" {...props}>
          확인
        </Button>
      );
  }
}
