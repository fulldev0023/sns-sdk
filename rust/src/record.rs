use crate::error::SnsError;

use {
    bech32,
    bech32::ToBase32,
    ed25519_dalek,
    solana_program::pubkey::Pubkey,
    std::net::{Ipv4Addr, Ipv6Addr},
};

#[derive(Copy, Clone, Debug)]
pub enum Record {
    Ipfs,
    Arwv,
    Sol,
    Eth,
    Btc,
    Ltc,
    Doge,
    Email,
    Url,
    Discord,
    Github,
    Reddit,
    Twitter,
    Telegram,
    Pic,
    Shdw,
    Point,
    Bsc,
    Injective,
    Backpack,
    A,
    AAAA,
    CNAME,
    TXT,
}

impl Record {
    pub fn as_str(&self) -> &'static str {
        match self {
            Record::Ipfs => "IPFS",
            Record::Arwv => "ARWV",
            Record::Sol => "SOL",
            Record::Eth => "ETH",
            Record::Btc => "BTC",
            Record::Ltc => "LTC",
            Record::Doge => "DOGE",
            Record::Email => "email",
            Record::Url => "url",
            Record::Discord => "discord",
            Record::Github => "github",
            Record::Reddit => "reddit",
            Record::Twitter => "twitter",
            Record::Telegram => "telegram",
            Record::Pic => "pic",
            Record::Shdw => "SHDW",
            Record::Point => "POINT",
            Record::Bsc => "BSC",
            Record::Injective => "INJ",
            Record::Backpack => "backpack",
            Record::A => "A",
            Record::AAAA => "AAAA",
            Record::CNAME => "CNAME",
            Record::TXT => "TXT",
        }
    }
}

pub fn check_sol_record(
    record: &[u8],
    signed_record: &[u8],
    pubkey: Pubkey,
) -> Result<bool, SnsError> {
    let key = ed25519_dalek::PublicKey::from_bytes(&pubkey.to_bytes())?;
    let sig = ed25519_dalek::Signature::from_bytes(signed_record)?;
    let res = key.verify_strict(record, &sig).is_ok();
    Ok(res)
}

pub fn get_record_size(record: Record) -> Option<usize> {
    match record {
        Record::Sol => Some(96),
        Record::Eth | Record::Bsc | Record::Injective => Some(20),
        Record::A => Some(4),
        Record::AAAA => Some(16),
        _ => None,
    }
}

pub fn deserialize_record(
    data: &[u8],
    record: Record,
    record_key: &Pubkey,
) -> Result<String, SnsError> {
    let size = get_record_size(record);

    if size.is_none() {
        let des = String::from_utf8(data.to_vec())?
            .trim_end_matches('\0')
            .to_string();
        return Ok(des);
    }

    let size = size.unwrap();
    let idx = data
        .iter()
        .rposition(|&byte| byte != 0)
        .map_or(0, |pos| pos + 1);

    // Old record UTF-8 encoded
    if size != idx {
        let address = String::from_utf8(data[0..idx].to_vec())?;
        match record {
            Record::Injective => {
                let (prefix, data, _) = bech32::decode(&address)?;
                if prefix == "inj" && data.len() == 32 {
                    return Ok(address);
                }
            }
            Record::Eth | Record::Bsc => {
                let prefix = address.get(0..2).ok_or(SnsError::InvalidRecordData)?;
                let hex = address.get(2..).ok_or(SnsError::InvalidRecordData)?;
                let decoded = hex::decode(hex)?;
                if prefix == "0x" && decoded.len() == 20 {
                    return Ok(address);
                }
            }
            Record::A => {
                let des = address.parse::<Ipv4Addr>();
                if des.is_ok() {
                    return Ok(address);
                }
            }
            Record::AAAA => {
                let des = address.parse::<Ipv6Addr>();
                if des.is_ok() {
                    return Ok(address);
                }
            }
            _ => {}
        }
        return Err(SnsError::InvalidReverse);
    }

    // Properly sized record
    match record {
        Record::Sol => {
            let signature = data.get(32..).ok_or(SnsError::InvalidRecordData)?;
            let dst = data.get(0..32).ok_or(SnsError::InvalidRecordData)?;
            let expected = [dst, &record_key.to_bytes()].concat();
            let valid = check_sol_record(&expected, signature, *record_key)?;
            if valid {
                let pubkey = Pubkey::new_from_array(dst.try_into().unwrap());
                return Ok(pubkey.to_string());
            }
        }
        Record::Eth | Record::Bsc => {
            let des = format!("0x{}", hex::encode(data));
            return Ok(des);
        }
        Record::Injective => {
            let des = bech32::encode("inj", data.to_base32(), bech32::Variant::Bech32)?;
            return Ok(des);
        }
        Record::A => {
            let bytes: [u8; 4] = data.try_into().unwrap();
            let ip = Ipv4Addr::from(bytes);
            return Ok(ip.to_string());
        }
        Record::AAAA => {
            let bytes: [u8; 16] = data.try_into().unwrap();
            let ip = Ipv6Addr::from(bytes);
            return Ok(ip.to_string());
        }
        _ => {}
    }

    Err(SnsError::InvalidRecordData)
}
