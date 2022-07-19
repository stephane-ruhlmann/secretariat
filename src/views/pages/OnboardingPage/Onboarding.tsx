import React from 'react';
import type { Request } from 'express'

import { hydrateOnClient } from '../../hydrateOnClient'
import { PageLayout } from '../components/PageLayout';
import CitySelect from '../components/CitySelect';

interface CommuneInfo {
    nom: string,
    codesPostaux?: string[]
}

interface Option {
  key: string,
  name: string
}

interface FormData {
    gender: string,
    legal_status: string,
    workplace_insee_code: string,
    tjm: number,
    secondary_email: string,
    osm_city: string,
}

interface Props {
    title?: string,
    errors?: string[],
    messages?: string[],
    request: Request,
    formData?: FormData,
    statusOptions?: Option[],
    genderOptions?: Option[],
    formValidationErrors?: Object,
    communeInfo?: CommuneInfo,
    startups?: string[],
    startupOptions?: Option[],
}

/* Pure component */
export const Onboarding = PageLayout(function (props: Props) {

    const [state, setState] = React.useState<any>({
        selectedName: '',
        ...props,
    });
    const css = ".panel { overflow: scroll; }"

    const changeFormData = (key, value) => {
        const formData = state.formData
        formData[key] = value
        setState({
            ...state,
            formData
        })
    }

    const handleGenderChange = (e) => {
        changeFormData('gender', e.currentTarget.value)
    }

    const handleLegalStatusChange = (e) => {
        changeFormData('legal_status', e.currentTarget.value)
    }

    const handleTJMChange = (e) => {
        changeFormData('tjm', e.currentTarget.value)
    }

    const handleSecondaryEmail = (e) => {
        changeFormData('secondary_email', e.currentTarget.value)

    }

    const handleCitySelect = (newValue) => {
        if (newValue.isOSM) {
            changeFormData('osm_city', JSON.stringify(newValue))
            changeFormData('workplace_insee_code', '')
        } else {
            changeFormData('workplace_insee_code', newValue.value)
            changeFormData('osm_city', '')
        }
    }

    const getDefaultValue = () => {
        if (props.formData.workplace_insee_code) {
            return props.communeInfo ? `${props.communeInfo.nom}  (${props.communeInfo.codesPostaux[0]})`: null
        } else if (state.formData.osm_city) {
            return JSON.parse(props.formData.osm_city).label
        } 
        return ''
    }

    return (
        <>
        <div className="module">
        <div className="row">
        <div className="panel margin-top-m">
            <h3>Mise à jour de mes informations</h3>

            <div className="beta-banner"></div>
            <form action="/onboarding" method="POST">
            <h4>Tes infos persos</h4>

            <div className="form__group">
                <p>
                    Tes informations personnelles seront affichées sur la page <a href="https://beta.gouv.fr/communaute/" target="_blank">Communauté</a> du site BetaGouv, ainsi que dans la fiche de ta startup.
                </p>
                <label htmlFor="firstName">
                    <strong>Prénom (obligatoire)</strong>
                </label>
                <input name="firstName" value="<%= formData.firstName %>" required/>
                <label htmlFor="lastName">
                    <strong>Nom de famille (obligatoire)</strong>
                </label>
                <input name="lastName" value="<%= formData.lastName %>" required/>
            </div>

            <div className="form__group">
                <label htmlFor="description">
                    <strong>Courte bio</strong><br />
                    Cette phrase d'accroche sera affichée sur <a href="https://beta.gouv.fr/communaute/annuaire">l'annuaire</a>.<br />
                    <i>Exemple : « Développeur le jour, musicien la nuit. »</i>
                    <textarea rows={2} name="description"></textarea>
                </label>
            </div>

            <div className="form__group">
                <label htmlFor="website">
                    <strong>Site personnel</strong><br />
                    Commençant avec <em>http://</em> ou <em>https://</em>
                </label>
                <input name="website" pattern="^(http|https)://.+" value="<%= formData.website %>" title="Doit commencer par http:// ou https://"/>
            </div>

            <div className="form__group">
                <label htmlFor="github">
                    <strong>Nom d'utilisateur Github si tu as un compte (sans @)</strong>
                </label>
                <p>Si tu ne sais pas ce qu'est Github, laisse ce champ vide.</p>
                <input name="github" pattern="^[A-z\d](?:[A-z\d]|-(?=[A-z\d])){0,38}$"
                    value="<%= formData.github %>"
                    title="Nom d'utilisateur Github si tu as un compte (sans @)"/>
            </div>

            <div className="form__group">
                <p>
                    
                </p>
                <div className="form__group">
                    <label htmlFor="gender">
                        <strong>Genre</strong><br />
                        Cette information est utilisée uniquement pour faire des statistiques. Elle n'est pas affichée.
                    </label>
                    <select name="gender" placeholder="Sélectionne une valeur" required>
                       <option value=""></option>
                    </select>
                </div>
            </div>

            <div className="form__group">
                <label htmlFor="workplace_insee_code">
                    <strong>Lieu de travail principal</strong><br />
                    Cette information est utilisée pour faire une carte des membres de la communauté 
                    <input
                        placeholder="Commune ou code postale"
                        type="text"
                        id="input-commune"/>
                    <input
                        name="workplace_insee_code"
                        type="text" id="input-insee-code" value="<%= formData.workplace_insee_code %>" hidden/>
                    <ul id="list-container-city"
                    >
                    </ul>
                </label>
            </div>
            <h4>Ta mission</h4>
            <div className="form__group">
                <label htmlFor="startup">
                    <strong>Domaine (obligatoire)</strong><br />
                    Quel est le domaine de ta mission ?
                </label>
                <select name="domaine" required>
                    <option value=""></option>
                </select>
            </div>
            <div className="form__group">
                <label htmlFor="role">
                    <strong>Rôle chez BetaGouv (obligatoire)</strong><br />
                    Quel est ton titre de poste ? Développeuse, Intrapreneur, Chargée de déploiement, Coach, UX Designer...
                </label>
                <input name="role" value="<%= formData.role %>" required/>
            </div>

            <div className="form__group">
                <label htmlFor="start">
                    <strong>Début de la mission (obligatoire)</strong><br />
                    <i>Au format JJ/MM/YYYY</i>
                </label>
                <input type="date" name="start" pattern="^\d{4}-\d{2}-\d{2}$" min="<%= userConfig.minStartDate %>" value="<%= formData.start %>" title="En format YYYY-MM-DD, par exemple : 2020-01-31" required/>
            </div>

            <div className="form__group">
                <label htmlFor="end">
                    <strong>Fin de la mission (obligatoire)</strong><br />
                    Si tu ne la connais pas, mets une date dans 3 mois, tu pourras la corriger plus tard.<br />
                    <i>Au format JJ/MM/YYYY</i>
                </label>
                <input type="date" name="end" pattern="^\d{4}-\d{2}-\d{2}$" value="<%= formData.end %>" title="En format YYYY-MM-DD, par exemple : 2020-01-31" required/>
            </div>

            <div className="form__group">
                <label htmlFor="status">
                    <strong>Statut (obligatoire)</strong><br />
                </label>
            </div>
            <div className="form__group">
                <label htmlFor="legal_status">
                    <strong>Statut legal (obligatoire)</strong><br />
                </label>
            </div>
            <div className="form__group">
                <label htmlFor="tjm">
                    <strong>TJM moyen HT (si tu es indépendant)</strong><br />
                    Cette information est utilisée uniquement pour faire des statistiques. Elle n'est pas affichée.
                    <input
                        value="<%= formData.tjm %>"
                        id="tjm" name="tjm" type="number" placeholder="TJM moyen ht en euros"/>
                </label>
            </div>
            <div className="form__group">
                <label htmlFor="referentList">
                    <b>Référent (obligatoire)</b><br />
                    Selectionne un membre l'équipe de co-animation avec qui tu es en contact.
                </label>
                    <input name="referentList" list="user_names" id="referentList" value="<%= formData.referentList %>" required/>
                    <datalist id="user_names"/>
            </div>

            <div className="form__group">
                <label htmlFor="startup">
                    <strong>Startup d'État</strong><br />
                    Laisser vide si elle n'apparaît pas. Tu pourras modifier ton profil plus tard.
                </label>
                <select name="startup">
                    <option value=""></option>
                </select>
            </div>
            <div className="form__group">
                <label htmlFor="employer">
                    <strong>Employeur</strong><br />
                    L'entité avec laquelle tu as signé ton contrat (DINUM, Octo...)
                </label>
                <input name="employer" value="<%= formData.employer %>"/>
            </div>

            <div className="form__group">
                <label htmlFor="badge">
                    <strong>Badge</strong><br />
                    Si tu souhaites accéder aux bureaux, il te faudra un badge. Il te faudra aussi en faire la demande séparément.
                    En cochant cette case, nous saurons que tu en fais la demande et le badge sera renouvellé automatiquement.
                </label>
                <select name="badge">
                    <option value=""></option>
                </select>
            </div>

            <h4>Ton email</h4>
            <label htmlFor="email">
                <strong>Email pro/perso (obligatoire)</strong><br />
                Ton email nous servira pour t'envoyer les informations relatives à ton compte
            </label>
            <input type="email" name="email" value="<%= formData.email %>" required/>

            <label htmlFor="isEmailBetaAsked" className="padding-10-0">
              <input type="checkbox" name="isEmailBetaAsked" value="true"/>
                Je souhaite une adresse @beta.gouv.fr
              <br/>
              <span>
                L'adresse @beta.gouv.fr donne accès aux outils officiels.
                Elle est obligatoire si tu ne possédes pas déjà une adresse d'une structure publique (@pole-emploi.fr, @culture.gouv.fr...)
              </span>
            </label>
                            <h4>Tes infos persos</h4>
                            <div className="form__group">
                                <p>
                                    
                                </p>
                                <div className="form__group">
                                    <label htmlFor="gender">
                                        <strong>Genre</strong><br />
                                        Cette information est utilisée uniquement pour faire des statistiques. Elle n'est pas affichée.
                                    </label>
                                    <select
                                        name="gender"
                                        value={state.formData.gender}
                                        onChange={handleGenderChange}
                                        placeholder="Sélectionne une valeur" required>
                                        <>
                                        { props.genderOptions.map((gender) => { 
                                            return <option
                                                key={gender.key}
                                                value={gender.key}
                                                >{gender.name}</option>
                                        })}
                                        </>
                                    </select>
                                    { !!props.formValidationErrors['gender'] && 
                                    <p className="text-small text-color-red">{props.formValidationErrors['gender']}</p>
                                    }
                                </div>
                            </div>

                            <div className="form__group">
                                <label htmlFor="workplace_insee_code">
                                    <strong>Lieu de travail</strong><br />
                                    Cette information est utilisée pour faire une carte des membres de la communauté 
                                    <br></br>
                                    <CitySelect
                                        defaultValue={getDefaultValue()}
                                        onChange={handleCitySelect}
                                        placeholder={'Commune ou code postale'}
                                    ></CitySelect>
                                    <input
                                        name="workplace_insee_code"
                                        type="text"
                                        id="input-insee-code"
                                        readOnly={true}
                                        value={state.formData.workplace_insee_code} hidden/>
                                    { !!props.formValidationErrors['workplace_insee_code'] && 
                                        <p className="text-small text-color-red">{props.formValidationErrors['workplace_insee_code']}</p>
                                    }
                                    <input
                                        name="osm_city"
                                        type="text"
                                        id="input-osm-city"
                                        readOnly={true}
                                        value={state.formData.osm_city} hidden/>
                                </label>
                            </div>
                            <div className="form__group">
                                <label htmlFor="legal_status">
                                    <strong>Statut legal de ton entreprise</strong><br />
                                </label>
                                { props.statusOptions.map((legal_status) => {
                                    
                                    return (<span key={legal_status.key}><input type="radio" name="legal_status"
                                        value={legal_status.key}
                                        onChange={handleLegalStatusChange}
                                        checked={legal_status.key === state.formData.legal_status}
                                        required/>{legal_status.name}<br/></span>)

                                })}
                                { !!props.formValidationErrors['legal_statut'] && 
                                    <p className="text-small text-color-red">{props.formValidationErrors['legal_statut']}</p>
                                }
                            </div>
                            <div className="form__group">
                                <label htmlFor="tjm">
                                    <strong>TJM moyen HT (si tu es indépendant)</strong><br />
                                    Cette information est utilisée uniquement pour faire des statistiques. Elle n'est pas affichée.
                                    <input
                                        onChange={handleTJMChange}
                                        value={state.formData.tjm || 0}
                                        id="tjm" name="tjm" type="number" placeholder="TJM moyen ht en euros"/>
                                </label>
                            </div>
                            <div className="form__group">
                                <label htmlFor="secondary_email">
                                    <strong>Email de récupération</strong><br />
                                    L'email de récupération est utile pour récupérer son mot de passe ou garder contact après ton départ.
                                    <input
                                        onChange={handleSecondaryEmail}
                                        value={state.formData.secondary_email || ''}
                                        id="secondary_email" name="secondary_email" type="email" placeholder="un email de recupération"/>
                                </label>
                                { !!props.formValidationErrors['secondary_email'] &&
                                    <p className="text-small text-color-red">{props.formValidationErrors['secondary_email']}</p>
                                }
                            </div>
                            <button className="button" type="submit">Changer ces informations</button>
                        </form>
                    </div>
                </div>
            </div>
        <style media="screen">
            {css}
        </style>
        </>
    )
})

hydrateOnClient(Onboarding)