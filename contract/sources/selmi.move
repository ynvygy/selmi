module selmi::selmi {
    use std::signer;
    use std::vector;
    use std::debug;
    use std::string::{Self, String, utf8};
    use aptos_framework::event;
    use std::option;
    use aptos_token_objects::collection::{Self};
    use aptos_framework::object;
    use aptos_token_objects::token::{Self, Token};
    use aptos_std::smart_vector;

    // Errors

    const GENERIC_ERROR: u64 = 1;

    // STATUSES
    // "OPEN" [Listings]
    // "ACTIVE" [Listings, Offer, CompanyOffer]
    // "REJECTED" [Listings, Offer, CompanyOffer]
    // "ACCEPTED" [Listings, Offer, CompanyOffer]
    // "INACTIVE" [Listings]

    // Structs

    struct Listing has copy, store, key {
        price: u64,
        description: String,
        status: String,
        photos: vector<String>,
        offers: vector<Offer>,
        estimates: vector<Estimation>,
        ai_estimates: vector<AiEstimation>,
        reviews: vector<Review>,
        legal_offers: vector<CompanyOffer>,
        legal_operator: address,
        timestamp: u64,
    }

    struct Listings has key {
        listings: smart_vector::SmartVector<Listing>,
    }

    struct Companies has key {
        addresses: smart_vector::SmartVector<address>
    }

    struct Company has key, copy, store {
        name: String,
        description: String,
        reviews: vector<Review>,
        timestamp: u64,
    }

    struct Offer has copy, store {
        description: String,
        status: String,
        price: u64,
        timestamp: u64,
    }

    struct Estimation has copy, store{
        company: address,
        price: u64,
        description: String,
        timestamp: u64,
    }

    struct AiEstimation has copy, store {
        ai_name: String,
        input: String,
        result: String,
        timestamp: u64,
    }

    struct Review has store, copy {
        description: String,
        rating: u64,
        timestamp: u64
    }

    struct CompanyOffer has copy, store {
        name: address,
        status: String,
        price: u64,
        timestamp: u64,
    }

    struct ListingOwners has key {
        addresses: smart_vector::SmartVector<address>
    }

    // EVENTS
    #[event]
    struct CompanyCreated has drop, store {
        company_address: address,
    }

    #[event]
    struct CompanyReviewed has drop, store {
        company_address: address,
        reviewer: address,
        review_description: String,
        review_rating: u64
    }

    #[event]
    struct ListingCreated has drop, store {
        owner_address: address,
        listing_index: u64,
        price: u64,
        description: String
    }

    #[event]
    struct ListingStatusChange has drop, store {
        owner_address: address,
        listing_index: u64,
        new_status: String
    }

    #[event]
    struct ListingOfferCreated has drop, store {
        owner_address: address,
        listing_index: u64,
        company_address: address,
    }

    #[event]
    struct ListingEstimateAdded has drop, store {
        owner_address: address,
        listing_index: u64,
        company_address: address,
        price: u64,
        description: String
    }

    #[event]
    struct ListingAiEstimateAdded has drop, store {
        owner_address: address,
        listing_index: u64,
        ai_estimator: String,
        price: String,
    }

    #[event]
    struct ListingLegalOfferCreated has drop, store {
        owner_address: address,
        listing_index: u64,
        company_address: address,
    }

    #[event]
    struct ListingLegalOfferOperatorSelected has drop, store {
        owner_address: address,
        listing_index: u64,
        company_address: address,
    }

    fun init_module(deployer: &signer) {
        move_to(deployer, ListingOwners {
            addresses: smart_vector::new(),
        });

        move_to(deployer, Companies {
            addresses: smart_vector::new(),
        });
    }

    public entry fun create_listing(user: &signer, price: u64, description: String, photos: vector<String>, timestamp: u64) acquires ListingOwners, Listings {
        let listing_owners = borrow_global_mut<ListingOwners>(@selmi);
        let user_address = signer::address_of(user);

        if (!smart_vector::contains(&listing_owners.addresses, &signer::address_of(user))) {
            smart_vector::push_back(&mut listing_owners.addresses, signer::address_of(user));
        };

        let new_listing = Listing {
            price: price,
            description: description,
            status: utf8(b"OPEN"),
            offers: vector::empty(),
            reviews: vector::empty(),
            estimates: vector::empty(),
            ai_estimates: vector::empty(),
            legal_offers: vector::empty(),
            legal_operator: user_address,
            photos: photos,
            timestamp: timestamp,
        };

        if (!exists<Listings>(user_address)) {
            move_to(user, Listings {
                listings: smart_vector::new(),
            });
        };

        let listings = borrow_global_mut<Listings>(user_address);

        smart_vector::push_back(&mut listings.listings, new_listing);

        let listings_length = smart_vector::length<Listing>(&listings.listings);

        event::emit(ListingCreated {
            owner_address: user_address,
            listing_index: listings_length,
            price: price,
            description: description
        });
    }

    public entry fun create_company(company: &signer, name: String, description: String, timestamp: u64) acquires Companies {
        let new_company = Company {
            name: name,
            description: description,
            reviews: vector::empty<Review>(),
            timestamp: timestamp,
        };

        move_to(company, new_company);

        let companies = borrow_global_mut<Companies>(@selmi);
        if (!smart_vector::contains(&companies.addresses, &signer::address_of(company))) {
            smart_vector::push_back(&mut companies.addresses, signer::address_of(company));
        };

        event::emit(CompanyCreated {
            company_address: signer::address_of(company),
        })
    }

    public entry fun add_listing_review(user: &signer, seller: address, index: u64, description: String, rating: u64, timestamp: u64) acquires Listings {
        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);

        let review = Review {
            description: description,
            rating: rating, timestamp: timestamp
        };

        vector::push_back(&mut listing.reviews, review);
    }

    public entry fun add_estimate(user: &signer, seller: address, index: u64, price: u64, description: String, timestamp: u64) acquires Listings {
        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);

        let company_address = signer::address_of(user);
        //let company = borrow_global<Company>(user_address);

        let estimation = Estimation {
            company: company_address,
            price: price,
            description: description,
            timestamp: timestamp,
        };

        vector::push_back(&mut listing.estimates, estimation);

        event::emit(ListingEstimateAdded {
            owner_address: seller,
            listing_index: index,
            company_address: company_address,
            price: price,
            description: description
        });
    }

    public entry fun add_ai_estimate(user: &signer, seller: address, index: u64, name: String, input: String, result: String, timestamp: u64) acquires Listings {
        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);

        let ai_estimation = AiEstimation {
            ai_name: name,
            input: input,
            result: result,
            timestamp: timestamp
        };

        vector::push_back(&mut listing.ai_estimates, ai_estimation);

        event::emit(ListingAiEstimateAdded {
            owner_address: seller,
            listing_index: index,
            ai_estimator: name,
            price: result,
        });
    }

    public entry fun add_offer(company: &signer, seller: address, index: u64, description: String, price: u64, timestamp: u64) acquires Listings {
        let new_offer = Offer { description: description, status: utf8(b"OPEN"), price: price, timestamp: timestamp };
        let company_address = signer::address_of(company);

        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);

        vector::push_back(&mut listing.offers, new_offer);

        event::emit(ListingLegalOfferCreated {
            owner_address: seller,
            listing_index: index,
            company_address: company_address,
        })
    }

    public entry fun change_offer_status(user: &signer, listing_index: u64, offer_index: u64, status: String) acquires Listings {
        let user_address = signer::address_of(user);
        let listings = borrow_global_mut<Listings>(user_address);
        let listing = smart_vector::borrow_mut(&mut listings.listings, listing_index);

        let offer = vector::borrow_mut(&mut listing.offers, offer_index);
        offer.status = status;

        event::emit(ListingStatusChange {
            owner_address: user_address,
            listing_index: index,
            new_status: status,
        })
    }

    public entry fun add_company_offer(user: &signer, seller: address, index: u64, price: u64, timestamp: u64) acquires Listings {
        let listings = borrow_global_mut<Listings>(seller);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);
        let user_address = signer::address_of(user);

        let company_offer = CompanyOffer {
            name: user_address,
            status: utf8(b"ACTIVE"),
            price: price,
            timestamp: timestamp
        };

        vector::push_back(&mut listing.legal_offers, company_offer);
    }

    public entry fun change_company_offer_status(user: &signer, listing_index: u64, company_offer_index: u64, status: String) acquires Listings {
        let user_address = signer::address_of(user);
        let listings = borrow_global_mut<Listings>(user_address);
        let listing = smart_vector::borrow_mut(&mut listings.listings, listing_index);

        let company_offer = vector::borrow_mut(&mut listing.legal_offers, company_offer_index);
        company_offer.status = status;
    }

    public entry fun add_company_review(user: &signer, company: address, description: String, rating: u64, timestamp: u64) acquires Company {
        let my_company = borrow_global_mut<Company>(company);

        let new_review = Review {
            description: description,
            rating: rating,
            timestamp: timestamp
        };

        vector::push_back(&mut my_company.reviews, new_review);

        event::emit(CompanyReviewed{
            company_address: company,
            reviewer: signer::address_of(user),
            review_description: description,
            review_rating: rating,
        })
    }

    public entry fun change_listing_status(user: &signer, index: u64, status: String) acquires Listings {
        let user_address = signer::address_of(user);
        let listings = borrow_global_mut<Listings>(user_address);
        let listing = smart_vector::borrow_mut(&mut listings.listings, index);
        listing.status = status;
    }

    #[view]
    public fun get_owners_list(): vector<address> acquires ListingOwners {
        if (exists<ListingOwners>(@selmi)) {
            smart_vector::to_vector(&borrow_global<ListingOwners>(@selmi).addresses)
        } else {
            vector[]
        }
    }

    #[view]
    public fun get_user_listings(user: address): vector<Listing> acquires Listings {
        if (exists<Listings>(user)) {
            smart_vector::to_vector(&borrow_global<Listings>(user).listings)
        } else {
            vector[]
        }
    }

    #[view]
    public fun get_user_listing(user: address, index: u64): Listing acquires Listings {
        let listings = borrow_global<Listings>(user);
        let listing = *smart_vector::borrow(&listings.listings, index);
        listing
    }

    #[view]
    public fun get_company(company: address): option::Option<Company> acquires Company {
        if (exists<Company>(company)) {
            option::some(*borrow_global<Company>(company))
        } else {
            option::none()
        }
    }

    #[view]
    public fun get_companies_list(): vector<address> acquires Companies {
        smart_vector::to_vector(&borrow_global<Companies>(@selmi).addresses)
    }
}
