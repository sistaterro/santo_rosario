import json
from pathlib import Path


LATIN_PATH = Path("www/data/latin.js")

PHRASES = [
    ("l001", "In hac domo habitat oratio.", "En esta casa habita la plegaria.", "Prayer dwells in this house."),
    ("l002", "Hic oratio habitat.", "Aquí habita la oración.", "Here prayer dwells."),
    ("l003", "Domus orationis, domus pacis.", "Casa de oración, casa de paz.", "A house of prayer, a house of peace."),
    ("l004", "Ora et spera.", "Reza y espera.", "Pray and hope."),
    ("l005", "Ora et labora.", "Reza y trabaja.", "Pray and work."),
    ("l006", "Semper orandum est.", "Hay que orar siempre.", "One must always pray."),
    ("l007", "Oratio lumen animae est.", "La oración es la luz del alma.", "Prayer is the light of the soul."),
    ("l008", "In silentio, Deus loquitur.", "En el silencio, Dios habla.", "In silence, God speaks."),
    ("l009", "Cor meum ad Te orat.", "Mi corazón reza hacia Ti.", "My heart prays toward You."),
    ("l010", "Ad Deum per orationem.", "Hacia Dios por medio de la oración.", "Toward God through prayer."),
    ("l011", "Ubi oratio, ibi pax.", "Donde hay oración, hay paz.", "Where there is prayer, there is peace."),
    ("l012", "Ubi fides, ibi spes.", "Donde hay fe, hay esperanza.", "Where there is faith, there is hope."),
    ("l013", "Oratio cordis numquam tacet.", "La oración del corazón nunca calla.", "The prayer of the heart never falls silent."),
    ("l014", "In oratione invenitur pax.", "En la oración se encuentra la paz.", "Peace is found in prayer."),
    ("l015", "Anima orando ascendit.", "El alma asciende rezando.", "The soul ascends by praying."),
    ("l016", "Per orationem ad lucem.", "Por la oración hacia la luz.", "Through prayer toward the light."),
    ("l017", "Deus audit cor orantis.", "Dios escucha el corazón de quien reza.", "God hears the heart of the one who prays."),
    ("l018", "Sit haec domus plena oratione.", "Que esta casa esté llena de oración.", "May this house be full of prayer."),
    ("l019", "Pax huic domui et omnibus habitantibus in ea.", "Paz a esta casa y a todos los que habitan en ella.", "Peace to this house and to all who dwell in it."),
    ("l020", "Rosarium in manibus, Deus in corde.", "El rosario en las manos, Dios en el corazón.", "The rosary in the hands, God in the heart."),
    ("l021", "Mane nobiscum, Domine.", "Quédate con nosotros, Señor.", "Stay with us, Lord."),
    ("l022", "Mater mea, fiducia mea.", "Madre mía, confianza mía.", "My Mother, my confidence."),
    ("l023", "Ora pro nobis.", "Ruega por nosotros.", "Pray for us."),
    ("l024", "Regina sacratissimi Rosarii, ora pro nobis.", "Reina del Santísimo Rosario, ruega por nosotros.", "Queen of the Most Holy Rosary, pray for us."),
    ("l025", "Ora pro nobis, sancta Dei Genitrix.", "Ruega por nosotros, Santa Madre de Dios.", "Pray for us, holy Mother of God."),
    ("l026", "Fiat mihi secundum verbum tuum.", "Hágase en mí según tu palabra.", "Let it be done to me according to your word."),
    ("l027", "Ecce ancilla Domini.", "He aquí la esclava del Señor.", "Behold the handmaid of the Lord."),
    ("l028", "Et Verbum caro factum est.", "Y el Verbo se hizo carne.", "And the Word was made flesh."),
    ("l029", "Et habitavit in nobis.", "Y habitó entre nosotros.", "And dwelt among us."),
    ("l030", "Gratia plena, Dominus tecum.", "Llena eres de gracia, el Señor está contigo.", "Full of grace, the Lord is with thee."),
    ("l031", "Sancta Maria, Mater Dei, ora pro nobis.", "Santa María, Madre de Dios, ruega por nosotros.", "Holy Mary, Mother of God, pray for us."),
    ("l032", "Cor Iesu, flagrans amore nostri.", "Corazón de Jesús, ardiente de amor por nosotros.", "Heart of Jesus, burning with love for us."),
    ("l033", "Inflamma cor nostrum amore tui.", "Enciende nuestro corazón con tu amor.", "Set our heart aflame with your love."),
    ("l034", "Iesu, mitis et humilis corde.", "Jesús, manso y humilde de corazón.", "Jesus, meek and humble of heart."),
    ("l035", "Fac cor nostrum secundum Cor tuum.", "Haz nuestro corazón semejante al tuyo.", "Make our heart like unto Thine."),
    ("l036", "Divinum auxilium maneat semper nobiscum.", "Que el auxilio divino permanezca siempre con nosotros.", "May the divine assistance remain always with us."),
    ("l037", "Domine Iesu Christe, miserere mei.", "Señor Jesucristo, ten misericordia de mí.", "Lord Jesus Christ, have mercy on me."),
    ("l038", "Kyrie eleison.", "Señor, ten piedad.", "Lord, have mercy."),
    ("l039", "Salve, Regina, Mater misericordiae.", "Dios te salve, Reina y Madre de misericordia.", "Hail, Queen, Mother of mercy."),
    ("l040", "Vita, dulcedo et spes nostra, salve.", "Vida, dulzura y esperanza nuestra, Dios te salve.", "Our life, our sweetness, and our hope, hail."),
    ("l041", "Ave, Crux, spes unica.", "Salve, Cruz, única esperanza.", "Hail, O Cross, our only hope."),
    ("l042", "Laudetur et adoretur in aeternum sanctissimum Sacramentum.", "Sea alabado y adorado por siempre el Santísimo Sacramento.", "May the Most Holy Sacrament be praised and adored forever."),
    ("l043", "Sub tuum praesidium.", "Bajo tu amparo.", "Under your protection."),
]


def load_latin_data():
    source = LATIN_PATH.read_text(encoding="utf-8")
    payload = source.split("=", 1)[1].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def main():
    data = load_latin_data()
    by_id = {phrase["id"]: phrase for phrase in data["frases"]}

    data["fuente"] = "latin.txt procesado y normalizado"
    data["regla"] = (
        "Las frases latinas se repiten desde el 1 de enero hasta completar el ano. "
        "En anos bisiestos, el 29 de febrero usa la misma frase asignada al 31 de diciembre."
    )
    data["translationSources"] = {
        "es": "Spanish editorial translation",
        "en": "English editorial translation from Latin/Spanish",
    }
    data["translationRule"] = (
        "Each phrase keeps the original Latin in latin and the Spanish text in traduccion. "
        "Localized phrase translations live in translations[languageCode]."
    )

    normalized = []
    for phrase_id, latin, spanish, english in PHRASES:
        phrase = by_id.get(phrase_id, {"id": phrase_id})
        phrase["latin"] = latin
        phrase["traduccion"] = spanish
        phrase.pop("nota", None)
        phrase["translations"] = {
            **phrase.get("translations", {}),
            "en": {
                "text": english,
                "source": "English editorial translation from Latin/Spanish",
            },
        }
        normalized.append(phrase)

    data["frases"] = normalized
    data["total"] = len(normalized)

    output = "window.SANTO_ROSARIO_LATIN = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    LATIN_PATH.write_text(output, encoding="utf-8")
    print(f"Updated {len(normalized)} Latin phrases with English translations.")


if __name__ == "__main__":
    main()
